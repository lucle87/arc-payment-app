import { Redis } from "@upstash/redis";

export type TxStatus = "Pending" | "Success" | "Failed";

export type TxRecord = {
  hash: string;
  owner: string;   // sender wallet — used to scope history per user
  address: string; // recipient
  amount: string;
  memo: string;
  timestamp: string;
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

/** Newest first. If owner is given, only that owner's transactions. */
export async function getTransactions(owner?: string): Promise<TxRecord[]> {
  const all = await readAll();
  const scoped = owner
    ? all.filter((t) => (t.owner || "").toLowerCase() === owner.toLowerCase())
    : all;
  return [...scoped].reverse();
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

/** Clear only this owner's history (or everything if no owner given). */
export async function clearTransactions(owner?: string): Promise<void> {
  try {
    if (!owner) {
      await redis.del(KEY);
      return;
    }
    const all = await readAll();
    const kept = all.filter((t) => (t.owner || "").toLowerCase() !== owner.toLowerCase());
    await writeAll(kept);
  } catch (e) {
    console.error("[store] clear failed:", e);
  }
}
