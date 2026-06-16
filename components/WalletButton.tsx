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
      <button
        onClick={login}
        className="rounded-xl bg-orange-500 px-6 py-2.5 font-semibold hover:bg-orange-400"
      >
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-2xl border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 hover:border-zinc-500"
      >
        {address && <Avatar address={address} size={30} />}
        <span className="text-left leading-tight">
          <span className="block text-xs text-zinc-200">{short(address)}</span>
          <span className="block text-[11px] font-semibold text-orange-400">{fmt(usdc)} USDC</span>
          <span className="block text-[11px] font-semibold text-blue-300">{fmt(eurc)} EURC</span>
        </span>
        <span className="text-zinc-500 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-700 bg-[#18181b] p-2 shadow-xl z-[100]">
          <div className="px-3 py-2 text-xs text-zinc-500 break-all">{address}</div>
          <button onClick={copyAddress} className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-zinc-800">
            {copied ? "Copied! ✓" : "Copy address"}
          </button>
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-zinc-800"
          >
            💧 Faucet
          </a>
          {exportWallet && (
            <button onClick={() => exportWallet()} className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-zinc-800">
              Export wallet
            </button>
          )}
          <button onClick={() => logout()} className="w-full text-left rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-zinc-800">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
