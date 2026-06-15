"use client";

import { useMemo, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { QRCodeSVG } from "qrcode.react";
import Avatar from "@/components/Avatar";

export default function ReceivePage() {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [copied, setCopied] = useState(false);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  async function copy() {
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
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Receive</h1>
        <p className="text-zinc-400 text-lg mb-10">
          Share your address or QR code to get paid in USDC.
        </p>

        {!ready ? null : !authenticated ? (
          <button onClick={login} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold">
            Login to get your address
          </button>
        ) : !address ? (
          <p className="text-zinc-500">Loading your wallet…</p>
        ) : (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col items-center text-center">
            <div className="mb-5">
              <Avatar address={address} size={56} />
            </div>

            <div className="rounded-2xl bg-white p-4">
              <QRCodeSVG value={address} size={220} bgColor="#ffffff" fgColor="#0a0a0a" />
            </div>

            <div className="mt-6 font-mono text-sm text-zinc-300 break-all">{address}</div>

            <button
              onClick={copy}
              className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-400"
            >
              {copied ? "Copied! ✓" : "Copy address"}
            </button>

            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-sm text-zinc-400 hover:text-orange-400"
            >
              💧 Need test USDC? Use the faucet →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
