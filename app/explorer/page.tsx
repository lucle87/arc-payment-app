"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import ExplorerClient from "@/components/ExplorerClient";

type Tx = {
  hash: string;
  owner: string;
  address: string;
  amount: string;
  memo?: string;
  status: string;
  timestamp?: string;
};

export default function HistoryPage() {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [txs, setTxs] = useState<Tx[]>([]);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  const reload = useCallback(async () => {
    if (!address) {
      setTxs([]);
      return;
    }
    try {
      const r = await fetch(`/api/transactions?owner=${address}`, { cache: "no-store" });
      const d = await r.json();
      setTxs(d.success ? d.transactions : []);
    } catch {
      setTxs([]);
    }
  }, [address]);

  useEffect(() => {
    reload();
  }, [reload]);

  const total = txs.length;
  const volume = txs.filter((t) => t.status === "Success").reduce((s, t) => s + Number(t.amount || 0), 0);
  const success = txs.filter((t) => t.status === "Success").length;

  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Payment History</h1>
        <p className="text-zinc-400 text-lg mb-10">Your payments on Arc testnet.</p>

        {!ready ? null : !authenticated ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center">
            <p className="text-zinc-400 mb-5">Log in to view your payment history.</p>
            <button onClick={login} className="rounded-xl bg-orange-500 px-7 py-3 font-semibold hover:bg-orange-400">
              Login
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="rounded-3xl bg-zinc-900 p-8">
                <div className="text-zinc-400 mb-2">Total Payments</div>
                <div className="text-4xl font-bold">{total}</div>
              </div>
              <div className="rounded-3xl bg-zinc-900 p-8">
                <div className="text-zinc-400 mb-2">Total Volume</div>
                <div className="text-4xl font-bold text-orange-400">{volume.toFixed(2)} USDC</div>
              </div>
              <div className="rounded-3xl bg-zinc-900 p-8">
                <div className="text-zinc-400 mb-2">Successful</div>
                <div className="text-4xl font-bold text-green-400">{success}</div>
              </div>
            </div>

            <ExplorerClient transactions={txs} owner={address as string} onChange={reload} />
          </>
        )}
      </div>
    </main>
  );
}
