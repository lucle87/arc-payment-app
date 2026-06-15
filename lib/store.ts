import fs from "fs/promises";
import path from "path";

export type TxStatus = "Pending" | "Success" | "Failed";

export type TxRecord = {
  hash: string;
  address: string;
  amount: string;
  memo: string;
  timestamp: string; // ISO 8601
  status: TxStatus;
};

const FILE = path.join(process.cwd(), "data", "transactions.json");

async function readAll(): Promise<TxRecord[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as TxRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(records: TxRecord[]): Promise<void> {
  try {
    await fs.writeFile(FILE, JSON.stringify(records, null, 2), "utf8");
  } catch (e) {
    console.error("Could not persist transactions:", e);
  }
}

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

// Wipe all stored history.
export async function clearTransactions(): Promise<void> {
  await writeAll([]);
}
