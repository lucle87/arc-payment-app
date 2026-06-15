"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TransactionTable from "./TransactionTable";
import TransactionChart from "./TransactionChart";
import ExportCsvButton from "./ExportCsvButton";

type Transaction = {
  hash: string;
  address: string;
  amount: string;
  memo?: string;
  status: string;
  timestamp?: string;
};

export default function ExplorerClient({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [clearing, setClearing] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.hash.toLowerCase().includes(q) ||
        (tx.address ?? "").toLowerCase().includes(q) ||
        (tx.memo ?? "").toLowerCase().includes(q)
    );
  }, [transactions, search]);

  async function clearHistory() {
    if (!confirm("Delete ALL transaction history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await fetch("/api/transactions", { method: "DELETE" });
      router.refresh(); // reload server data
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="space-y-8">
      <TransactionChart transactions={transactions} />

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
        <input
          type="text"
          placeholder="Search by hash, address or memo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none"
        />
        <ExportCsvButton transactions={filtered} />
        <button
          onClick={clearHistory}
          disabled={clearing || transactions.length === 0}
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-red-400 hover:bg-red-500/20 disabled:opacity-40"
        >
          {clearing ? "Clearing…" : "Clear history"}
        </button>
      </div>

      <TransactionTable transactions={filtered} />
    </div>
  );
}
