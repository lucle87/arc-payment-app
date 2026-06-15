"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useContacts } from "@/lib/useContacts";
import { useSendUsdc } from "@/lib/useSendUsdc";

type Result =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; hash: string; txStatus: string; seconds: number; fee: string | null }
  | { status: "error"; message: string };

const HEX = /^0x[0-9a-fA-F]{40}$/;

export default function SendForm({ onSent }: { onSent?: () => void }) {
  const { authenticated, login } = usePrivy();
  const { contacts, nameByAddress } = useContacts();
  const { send } = useSendUsdc();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<Result>({ status: "idle" });

  // Prefill from a payment-request link: /send?to=..&amount=..&memo=..
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const to = q.get("to");
    const amt = q.get("amount");
    const m = q.get("memo");
    if (to && HEX.test(to)) setAddress(to);
    if (amt && Number(amt) > 0) setAmount(amt);
    if (m) setMemo(m);
  }, []);

  const amountNum = Number(amount);
  const amountValid = Number.isFinite(amountNum) && amountNum > 0;
  const addressValid = HEX.test(address);
  const canSubmit = addressValid && amountValid;
  const recipientName = nameByAddress(address) ?? address;

  async function doSend() {
    setResult({ status: "sending" });
    try {
      const { hash, status, seconds, fee } = await send({ to: address, amount, memo });
      setResult({ status: "success", hash, txStatus: status, seconds, fee });
      setAddress("");
      setAmount("");
      setMemo("");
      onSent?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Transaction failed. Please try again.";
      setResult({ status: "error", message: msg });
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <h2 className="text-3xl font-bold mb-8">Send Payment</h2>

      {!authenticated ? (
        <button onClick={login} className="w-full rounded-xl bg-orange-500 py-3 font-semibold">
          Login to send
        </button>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-zinc-400">Recipient</label>
            <select
              value={contacts.some((c) => c.address === address) ? address : ""}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 mb-3"
            >
              <option value="">
                {contacts.length ? "Select a contact…" : "No contacts — add some, or paste below"}
              </option>
              {contacts.map((c) => (
                <option key={c.id} value={c.address}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
              placeholder="…or paste an address (0x…)"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm"
            />
            {address && !addressValid && <p className="mt-2 text-sm text-red-400">Invalid address</p>}
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">Amount (USDC)</label>
            <input
              type="number"
              min="0"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            />
            {amount && !amountValid && <p className="mt-2 text-sm text-red-400">Enter a positive amount</p>}
          </div>

          <div>
            <label className="block mb-2 text-zinc-400">Memo (optional)</label>
            <textarea
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Dinner 🍕"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            />
          </div>

          {!confirming ? (
            <button
              disabled={!canSubmit || result.status === "sending"}
              onClick={() => setConfirming(true)}
              className="w-full rounded-xl bg-orange-500 py-3 font-semibold disabled:opacity-40"
            >
              Review &amp; Send
            </button>
          ) : (
            <div className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4 space-y-4">
              <p className="text-sm">
                Send <span className="font-bold text-orange-400">{amount} USDC</span> to{" "}
                <span className="font-bold break-all">{recipientName}</span>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirming(false)} className="flex-1 rounded-xl border border-zinc-700 py-3">
                  Cancel
                </button>
                <button
                  disabled={result.status === "sending"}
                  onClick={doSend}
                  className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold disabled:opacity-40"
                >
                  {result.status === "sending" ? "Sending…" : "Confirm"}
                </button>
              </div>
            </div>
          )}

          {result.status === "success" && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-green-400 font-bold text-lg mb-1">
                {result.txStatus === "Success"
                  ? `⚡ Confirmed in ${result.seconds.toFixed(1)}s`
                  : `Submitted in ${result.seconds.toFixed(1)}s ⏳`}
              </p>
              {result.fee && Number(result.fee) > 0 && (
                <p className="text-xs text-zinc-400 mb-2">
                  Network fee ≈ {Number(result.fee).toFixed(4)} USDC · paid in USDC on Arc
                </p>
              )}
              {result.hash && (
                <a href={`/explorer/${result.hash}`} className="text-sm text-blue-400 break-all underline">
                  {result.hash}
                </a>
              )}
            </div>
          )}

          {result.status === "error" && (
            <p className="rounded-2xl bg-red-500/10 p-4 text-red-400">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
