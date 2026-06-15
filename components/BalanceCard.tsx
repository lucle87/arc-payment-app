"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { getUsdcBalance } from "@/lib/chain";

export default function BalanceCard({ refreshSignal = 0 }: { refreshSignal?: number }) {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const b = await getUsdcBalance(address as `0x${string}`);
      setBalance(b);
    } catch {
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    load();
  }, [load, refreshSignal]);

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <div className="flex items-center justify-between">
        <div className="text-zinc-400">Wallet Balance</div>
        {address && (
          <button onClick={load} className="text-xs text-zinc-500 hover:text-orange-400 transition">
            ↻ Refresh
          </button>
        )}
      </div>

      {!authenticated ? (
        <button
          onClick={login}
          className="mt-4 rounded-xl bg-orange-500 px-5 py-3 font-semibold"
        >
          Login to view balance
        </button>
      ) : (
        <>
          <div className="mt-3 text-5xl font-bold text-orange-400">
            {loading || balance == null ? (
              <span className="text-zinc-600">…</span>
            ) : (
              <>
                {Number(balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
                <span className="text-2xl text-zinc-400">USDC</span>
              </>
            )}
          </div>
          {address && (
            <div className="mt-4 font-mono text-sm text-zinc-500 break-all">{short}</div>
          )}
        </>
      )}
    </div>
  );
}
