"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useMemo, useState } from "react";
import { getUsdcBalance } from "@/lib/chain";
import Avatar from "./Avatar";

export default function WalletButton() {
  const { ready, authenticated, login, logout, createWallet, exportWallet } = usePrivy();
  const { ready: walletsReady, wallets } = useWallets();
  const [balance, setBalance] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedded = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy"),
    [wallets]
  );
  const address = embedded?.address;

  useEffect(() => {
    if (!authenticated || !walletsReady) return;
    if (!embedded && !creating) {
      setCreating(true);
      createWallet().catch(() => {}).finally(() => setCreating(false));
    }
  }, [authenticated, walletsReady, embedded, creating, createWallet]);

  useEffect(() => {
    if (!address) return setBalance(null);
    getUsdcBalance(address as `0x${string}`).then(setBalance).catch(() => setBalance(null));
  }, [address]);

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

  if (!ready) return null;

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="rounded-xl bg-orange-500 px-6 py-2.5 font-semibold hover:bg-orange-400 transition"
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 hover:bg-zinc-800 hover:border-zinc-600 transition"
      >
        <Avatar address={address} size={32} />
        <span className="text-left leading-tight">
          <span className="block font-mono text-sm text-zinc-100">
            {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : creating ? "Creating…" : "Loading…"}
          </span>
          <span className="block text-xs text-orange-400 font-semibold">
            {balance != null ? `${Number(balance).toFixed(2)} USDC` : "—"}
          </span>
        </span>
        <span className="text-zinc-500">▾</span>
      </button>

      {open && address && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-700 p-4 shadow-2xl z-[100]"
            style={{ backgroundColor: "#18181b" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar address={address} size={40} />
              <div className="font-mono text-xs text-zinc-100 break-all">{address}</div>
            </div>

            <button
              onClick={copyAddress}
              className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 mb-2"
            >
              {copied ? "Copied! ✓" : "Copy address"}
            </button>
            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center rounded-xl border border-zinc-600 py-2.5 text-sm text-zinc-100 hover:bg-zinc-800 mb-2"
            >
              💧 Get test USDC
            </a>
            <button
              onClick={() => exportWallet()}
              className="w-full rounded-xl border border-zinc-600 py-2.5 text-sm text-zinc-100 hover:bg-zinc-800 mb-2"
            >
              Export private key
            </button>
            <button
              onClick={logout}
              className="w-full rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
