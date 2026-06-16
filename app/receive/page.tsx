"use client";

import { useMemo, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { QRCodeSVG } from "qrcode.react";
import Avatar from "@/components/Avatar";
import type { TokenSymbol } from "@/lib/chain";

export default function ReceivePage() {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [copied, setCopied] = useState(false);

  const [token, setToken] = useState<TokenSymbol>("USDC");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  const requestLink = useMemo(() => {
    if (!address) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({ to: address, token });
    if (Number(amount) > 0) params.set("amount", amount);
    if (memo.trim()) params.set("memo", memo.trim());
    return `${origin}/send?${params.toString()}`;
  }, [address, amount, memo, token]);

  async function copyText(text: string, which: "addr" | "link") {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (which === "addr") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    }
  }

  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Receive</h1>
        <p className="text-zinc-400 text-lg mb-10">
          Share your address to get paid in USDC or EURC, or create a request link.
        </p>

        {!ready ? null : !authenticated ? (
          <button onClick={login} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold">
            Login to get your address
          </button>
        ) : !address ? (
          <p className="text-zinc-500">Loading your wallet…</p>
        ) : (
          <div className="space-y-8">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col items-center text-center">
              <div className="mb-5">
                <Avatar address={address} size={56} />
              </div>
              <div className="rounded-2xl bg-white p-4">
                <QRCodeSVG value={address} size={200} bgColor="#ffffff" fgColor="#0a0a0a" />
              </div>
              <div className="mt-6 font-mono text-sm text-zinc-300 break-all">{address}</div>
              <button
                onClick={() => copyText(address, "addr")}
                className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-400"
              >
                {copied ? "Copied! ✓" : "Copy address"}
              </button>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
              <h2 className="text-xl font-semibold mb-4">Request a payment</h2>

              <div className="flex gap-2 mb-3">
                {(["USDC", "EURC"] as TokenSymbol[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setToken(t)}
                    className={
                      token === t
                        ? "flex-1 rounded-xl bg-orange-500 py-2.5 font-semibold"
                        : "flex-1 rounded-xl border border-zinc-700 py-2.5 text-zinc-300 hover:bg-zinc-900"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Amount (${token})`}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
                />
                <input
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="What's it for? (optional)"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
                />
              </div>

              {Number(amount) > 0 && (
                <div className="mt-5 flex flex-col items-center text-center">
                  <div className="rounded-2xl bg-white p-3">
                    <QRCodeSVG value={requestLink} size={160} bgColor="#ffffff" fgColor="#0a0a0a" />
                  </div>
                  <div className="mt-4 text-xs text-zinc-500 break-all">{requestLink}</div>
                  <button
                    onClick={() => copyText(requestLink, "link")}
                    className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-semibold hover:bg-orange-400"
                  >
                    {linkCopied ? "Link copied! ✓" : "Copy request link"}
                  </button>
                  <p className="mt-3 text-xs text-zinc-500">
                    Anyone who opens this link gets a pre-filled payment to you.
                  </p>
                </div>
              )}
            </div>

            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm text-zinc-400 hover:text-orange-400"
            >
              💧 Need test USDC or EURC? Use the faucet →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
