"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useContacts } from "@/lib/useContacts";
import { getUsdcBalance, getEurcBalance } from "@/lib/chain";

type Tx = { amount: string; status: string; token?: string };

export default function HomeStats({ refreshSignal = 0 }: { refreshSignal?: number }) {
  const { wallets } = useWallets();
  const { contacts } = useContacts();
  const [usdc, setUsdc] = useState<string | null>(null);
  const [eurc, setEurc] = useState<string | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  useEffect(() => {
    if (!address) {
      setUsdc(null);
      setEurc(null);
      return;
    }
    getUsdcBalance(address as `0x${string}`).then(setUsdc).catch(() => setUsdc(null));
    getEurcBalance(address as `0x${string}`).then(setEurc).catch(() => setEurc(null));
  }, [address, refreshSignal]);

  useEffect(() => {
    if (!address) {
      setTxs([]);
      return;
    }
    fetch(`/api/transactions?owner=${address}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setTxs(d.transactions))
      .catch(() => {});
  }, [address, refreshSignal]);

  const volumeOf = (token: "USDC" | "EURC") =>
    txs
      .filter((t) => t.status === "Success" && (t.token ?? "USDC") === token)
      .reduce((s, t) => s + Number(t.amount || 0), 0);

  const usdcVolume = volumeOf("USDC");
  const eurcVolume = volumeOf("EURC");

  const fmt = (v: string | null) =>
    v != null
      ? Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "…";

  return (
    <div className="grid md:grid-cols-4 gap-8 mb-16">
      <div className="bg-zinc-900 rounded-3xl p-8">
        <div className="text-zinc-400 mb-3">Balance</div>
        <div className="text-3xl font-bold text-orange-400">
          {fmt(usdc)} <span className="text-xl text-orange-300/80">USDC</span>
        </div>
        <div className="mt-2 text-3xl font-bold text-blue-300">
          {fmt(eurc)} <span className="text-xl text-blue-300/70">EURC</span>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8">
        <div className="text-zinc-400 mb-2">Payments</div>
        <div className="text-4xl font-bold">{txs.length}</div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8">
        <div className="text-zinc-400 mb-2">Contacts</div>
        <div className="text-4xl font-bold">{contacts.length}</div>
      </div>

      <div className="bg-zinc-900 rounded-3xl p-8">
        <div className="text-zinc-400 mb-3">Volume</div>
        <div className="text-3xl font-bold text-green-400">
          {usdcVolume.toFixed(2)} <span className="text-xl text-green-400/80">USDC</span>
        </div>
        <div className="mt-2 text-3xl font-bold text-blue-300">
          {eurcVolume.toFixed(2)} <span className="text-xl text-blue-300/70">EURC</span>
        </div>
      </div>
    </div>
  );
}
