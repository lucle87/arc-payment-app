import { Redis } from "@upstash/redis";

export type TxStatus = "Pending" | "Success" | "Failed";
export type TxToken = "USDC" | "EURC";

export type TxRecord = {
  hash: string;
  owner: string;
  address: string;
  amount: string;
  token: TxToken;
  memo: string;
  timestamp: string;
  status: TxStatus;
  memoId?: string;
  onchainMemo?: boolean;
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
