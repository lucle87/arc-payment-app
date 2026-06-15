"use client";

import { useState, useEffect } from "react";
import { getAddress } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { contacts } from "@/lib/contacts";
import { useSendUsdc } from "@/lib/useSendUsdc";

type Result =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; hash: string; txStatus: string }
  | { status: "error"; message: string };

// Accept any-cased valid address; reject only bad format.
const HEX = /^0x[0-9a-fA-F]{40}$/;
function isValidAddr(a: string) {
  return HEX.test(a);
}

export default function SendForm({ onSent }: { onSent?: () => void }) {
  const { authenticated, login } = usePrivy();
  const { send } = useSendUsdc();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<Result>({ status: "idle" });

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to && isValidAddr(to)) setAddress(to);
  }, []);

  const amountNum = Number(amount);
  const amountValid = Number.isFinite(amountNum) && amountNum > 0;
  const addressValid = isValidAddr(address);
  const canSubmit = addressValid && amountValid;

  const recipientName = contacts.find((c) => c.address === address)?.name ?? address;

  async function doSend() {
    setResult({ status: "sending" });
    try {
      const { hash, status } = await send({ to: address, amount, memo });
      setResult({ status: "success", hash, txStatus: status });
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
              <option value="">Select a contact…</option>
              {contacts.map((c) => (
                <option key={c.address} value={c.address}>
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
            {address && !addressValid && (
              <p className="mt-2 text-sm text-red-400">Invalid address</p>
            )}
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
            {amount && !amountValid && (
              <p className="mt-2 text-sm text-red-400">Enter a positive amount</p>
            )}
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
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-xl border border-zinc-700 py-3"
                >
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
            <div className="rounded-2xl bg-zinc-900 p-4">
              <p className="text-green-400 font-semibold mb-1">
                Payment {result.txStatus === "Success" ? "confirmed ✅" : "submitted ⏳"}
              </p>
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
