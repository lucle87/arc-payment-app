import { Redis } from "@upstash/redis";

/**
 * Transaction store backed by Upstash Redis (works on Vercel serverless,
 * unlike the previous file-based store which can't persist there).
 *
 * Function names are unchanged, so no other file needs editing.
 * Records are kept in a single JSON list under the key below.
 */

export type TxStatus = "Pending" | "Success" | "Failed";

export type TxRecord = {
  hash: string;
  address: string;
  amount: string;
  memo: string;
  timestamp: string; // ISO 8601
  status: TxStatus;
};

const KEY = "transactions";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function readAll(): Promise<TxRecord[]> {
  try {
    const data = await redis.get<TxRecord[]>(KEY);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("[store] read failed:", e);
    return [];
  }
}

async function writeAll(records: TxRecord[]): Promise<void> {
  try {
    await redis.set(KEY, records);
  } catch (e) {
    console.error("[store] write failed:", e);
  }
}

/** Newest first. */
export async function getTransactions(): Promise<TxRecord[]> {
  const all = await readAll();
  return [...all].reverse();
}

export async function addTransaction(tx: TxRecord): Promise<void> {
  const all = await readAll();
  all.push(tx);
  await writeAll(all);
}

export async function updateStatus(hash: string, status: TxStatus): Promise<void> {
  const all = await readAll();
  const i = all.findIndex((t) => t.hash === hash);
  if (i >= 0) {
    all[i].status = status;
    await writeAll(all);
  }
}

/** Wipe all stored history (used by the "Clear history" button). */
export async function clearTransactions(): Promise<void> {
  try {
    await redis.del(KEY);
  } catch (e) {
    console.error("[store] clear failed:", e);
  }
}
