"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Avatar from "./Avatar";
import { getUsdcBalance, getEurcBalance } from "@/lib/chain";

export default function WalletButton() {
  const { ready, authenticated, login, logout, exportWallet } = usePrivy();
  const { wallets } = useWallets();

  const [open, setOpen] = useState(false);
  const [usdc, setUsdc] = useState<string | null>(null);
  const [eurc, setEurc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
  }, [address]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const fmt = (v: string | null) =>
    v != null
      ? Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "…";
  const short = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");

  if (!ready) return null;

  if (!authenticated) {
    return (
      <button onClick={login} className="rounded-xl bg-orange-500 px-6 py-2.5 font-semibold text-white hover:bg-orange-400">
        Login
      </button>
    );
  }

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = address;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const itemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-100 hover:bg-zinc-800 transition";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-2xl border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 hover:border-zinc-500"
      >
        {address && <Avatar address={address} size={30} />}
        <span className="text-sm text-zinc-200">{short(address)}</span>
        <span className="text-zinc-500 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-700 bg-[#18181b] p-2 shadow-2xl shadow-black/50 z-[100]">
          {/* Address block */}
          <div className="rounded-xl bg-zinc-900 px-3 py-3 mb-1">
            <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">Wallet address</div>
            <div className="font-mono text-xs text-zinc-200 break-all leading-relaxed">{address}</div>
            <div className="mt-2 flex gap-3 text-[11px]">
              <span className="text-orange-400 font-semibold">{fmt(usdc)} USDC</span>
              <span className="text-blue-300 font-semibold">{fmt(eurc)} EURC</span>
            </div>
          </div>

          <button onClick={copyAddress} className={itemClass}>
            <span className="text-base">⧉</span>
            {copied ? "Copied! ✓" : "Copy address"}
          </button>
          <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className={itemClass}>
            <span className="text-base">💧</span>
            Faucet
          </a>
          {exportWallet && (
            <button onClick={() => exportWallet()} className={itemClass}>
              <span className="text-base">🔑</span>
              Export wallet
            </button>
          )}

          <div className="my-1 border-t border-zinc-800" />

          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <span className="text-base">⏻</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
