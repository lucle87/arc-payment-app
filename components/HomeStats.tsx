"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { contacts } from "@/lib/contacts";
import { getUsdcBalance } from "@/lib/chain";

type Tx = { amount: string; status: string };

export default function HomeStats({ refreshSignal = 0 }: { refreshSignal?: number }) {
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }
    getUsdcBalance(address as `0x${string}`).then(setBalance).catch(() => setBalance(null));
  }, [address, refreshSignal]);

  useEffect(() => {
    fetch("/api/transactions", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setTxs(d.transactions))
      .catch(() => {});
  }, [refreshSignal]);

  const volume = txs
    .filter((t) => t.status === "Success")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const cards = [
    {
      label: "Balance",
      value:
        address && balance != null
          ? `${Number(balance).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC`
          : address
          ? "…"
          : "Login",
      accent: "text-orange-400",
    },
    { label: "Payments", value: String(txs.length), accent: "" },
    { label: "Contacts", value: String(contacts.length), accent: "" },
    { label: "Volume", value: `${volume.toFixed(2)} USDC`, accent: "text-green-400" },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-8 mb-16">
      {cards.map((c) => (
        <div key={c.label} className="bg-zinc-900 rounded-3xl p-8">
          <div className="text-zinc-400 mb-2">{c.label}</div>
          <div className={`text-4xl font-bold ${c.accent}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
