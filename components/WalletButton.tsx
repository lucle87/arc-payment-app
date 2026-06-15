"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useMemo, useState } from "react";
import { getUsdcBalance } from "@/lib/chain";

export default function WalletButton() {
  const { ready, authenticated, login, logout, createWallet, exportWallet } =
    usePrivy();
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
    getUsdcBalance(address as `0x${string}`)
      .then(setBalance)
      .catch(() => setBalance(null));
  }, [address]);

  async function copyAddress() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Fallback for non-secure contexts (http localhost on some browsers)
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
        className="rounded-xl bg-orange-500 px-5 py-2 font-semibold hover:bg-orange-400"
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
      >
        <span className="font-mono">
          {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : creating ? "Creating…" : "Loading…"}
        </span>
        <span className="text-zinc-400">
          {balance != null ? `${Number(balance).toFixed(2)} USDC` : ""}
        </span>
        <span className="text-zinc-500">▾</span>
      </button>

      {open && address && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl z-50">
          <div className="text-xs text-zinc-400 mb-1">Wallet address</div>
          <div className="font-mono text-xs break-all mb-3">{address}</div>

          <button
            onClick={copyAddress}
            className="w-full rounded-xl bg-orange-500 py-2 text-sm font-semibold hover:bg-orange-400 mb-2"
          >
            {copied ? "Copied! ✓" : "Copy address"}
          </button>

          <button
            onClick={() => exportWallet()}
            className="w-full rounded-xl border border-zinc-700 py-2 text-sm hover:bg-zinc-900 mb-2"
          >
            Export private key
          </button>

          <button
            onClick={logout}
            className="w-full rounded-xl border border-zinc-800 py-2 text-sm text-zinc-400 hover:bg-zinc-900"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
