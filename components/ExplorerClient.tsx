"use client";

import { useMemo, useState } from "react";
import TransactionTable from "./TransactionTable";

type Transaction = {
  hash: string;
  address: string;
  amount: string;
  memo: string;
  status: string;
  time?: string;
  timestamp?: string;
};

export default function ExplorerClient({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const value = search.toLowerCase();

      return (
        tx.hash.toLowerCase().includes(value) ||
        tx.address.toLowerCase().includes(value) ||
        tx.memo.toLowerCase().includes(value)
      );
    });
  }, [transactions, search]);

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-bold mb-4">
          Recent Payments
        </h1>

        <p className="text-zinc-400 text-lg">
          View payment history on ARC.
        </p>

      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">

        <input
          type="text"
          placeholder="Search by hash, address or memo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none"
        />

      </div>

      <TransactionTable
        transactions={filteredTransactions}
      />

    </div>
  );
}