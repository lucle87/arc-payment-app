"use client";

import { useEffect, useState } from "react";

type Tx = {
  hash: string;
  address: string;
  amount: string;
  memo?: string;
  timestamp: string;
  status: string;
};

export default function RecentPayments({
  refreshSignal = 0,
}: {
  refreshSignal?: number;
}) {
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    fetch("/api/transactions", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setTxs(d.transactions.slice(0, 5)))
      .catch(() => {});
  }, [refreshSignal]);

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 mt-12">
      <h2 className="text-3xl font-bold mb-8">Recent Payments</h2>

      {txs.length === 0 ? (
        <p className="text-zinc-500">No payments yet.</p>
      ) : (
        <div className="space-y-5">
          {txs.map((tx, i) => (
            <a
              key={tx.hash || i}
              href={tx.hash ? `/explorer/${tx.hash}` : "#"}
              className="flex justify-between items-center border-b border-zinc-800 pb-4 hover:opacity-80"
            >
              <div>
                <div className="font-bold">
                  {(tx.address ?? "").slice(0, 8)}…{(tx.address ?? "").slice(-6)}
                </div>
                <div className="text-zinc-400 text-sm">
                  {tx.timestamp
                    ? new Date(tx.timestamp).toLocaleString()
                    : ""}
                  {tx.status !== "Success" ? ` · ${tx.status}` : ""}
                </div>
              </div>
              <div className="text-green-400 font-bold">{tx.amount} USDC</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
