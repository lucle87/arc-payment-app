"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useContacts } from "@/lib/useContacts";
import { useSendUsdc } from "@/lib/useSendUsdc";

type Parsed = { recipient: string; address: string; amount: string; memo: string };

type Phase =
  | { status: "idle" }
  | { status: "parsing" }
  | { status: "review"; parsed: Parsed }
  | { status: "sending" }
  | { status: "success"; hash: string; txStatus: string }
  | { status: "error"; message: string };

export default function AISendForm({ onSent }: { onSent?: () => void }) {
  const { authenticated, login } = usePrivy();
  const { resolveByName } = useContacts();
  const { send } = useSendUsdc();
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>({ status: "idle" });

  async function parse() {
    if (!text.trim()) return;
    if (!authenticated) return login();
    setPhase({ status: "parsing" });
    try {
      const res = await fetch("/api/ai-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.success) {
        setPhase({ status: "error", message: data.error });
        return;
      }
      // Resolve the contact name -> address on the client (localStorage).
      const contact = resolveByName(data.recipient);
      if (!contact) {
        setPhase({
          status: "error",
          message: `Contact "${data.recipient}" not found. Add them in Contacts.`,
        });
        return;
      }
      setPhase({
        status: "review",
        parsed: {
          recipient: contact.name,
          address: contact.address,
          amount: data.amount,
          memo: data.memo ?? "",
        },
      });
    } catch {
      setPhase({ status: "error", message: "Network error" });
    }
  }

  async function confirmSend(parsed: Parsed) {
    setPhase({ status: "sending" });
    try {
      const { hash, status } = await send({ to: parsed.address, amount: parsed.amount, memo: parsed.memo });
      setPhase({ status: "success", hash, txStatus: status });
      setText("");
      onSent?.();
    } catch (e) {
      setPhase({ status: "error", message: e instanceof Error ? e.message : "Payment failed" });
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <h2 className="text-3xl font-bold mb-2">AI Payment</h2>
      <p className="text-zinc-500 mb-6 text-sm">Describe the payment in plain English.</p>

      {!authenticated ? (
        <button onClick={login} className="w-full rounded-xl bg-orange-500 py-3 font-semibold">
          Login to send
        </button>
      ) : (
        <>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Send 0.1 USDC to Alice for dinner 🍕"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
          />
          <button
            disabled={phase.status === "parsing" || !text.trim()}
            onClick={parse}
            className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-semibold disabled:opacity-40"
          >
            {phase.status === "parsing" ? "Reading…" : "Parse with AI"}
          </button>

          {phase.status === "review" && (
            <div className="mt-6 rounded-xl border border-orange-500/40 bg-orange-500/10 p-4 space-y-3">
              <div className="text-sm space-y-1">
                <div>Recipient: <span className="font-bold">{phase.parsed.recipient}</span></div>
                <div>Amount: <span className="font-bold text-orange-400">{phase.parsed.amount} USDC</span></div>
                {phase.parsed.memo && <div className="text-zinc-400">Memo: {phase.parsed.memo}</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPhase({ status: "idle" })} className="flex-1 rounded-xl border border-zinc-700 py-3">
                  Cancel
                </button>
                <button onClick={() => confirmSend(phase.parsed)} className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold">
                  Confirm &amp; Send
                </button>
              </div>
            </div>
          )}

          {phase.status === "sending" && <p className="mt-6 text-zinc-400">Sending…</p>}

          {phase.status === "success" && (
            <div className="mt-6 rounded-2xl bg-zinc-900 p-4">
              <p className="text-green-400 font-semibold mb-1">
                Payment {phase.txStatus === "Success" ? "confirmed ✅" : "submitted ⏳"}
              </p>
              {phase.hash && (
                <a href={`/explorer/${phase.hash}`} className="text-sm text-blue-400 break-all underline">
                  {phase.hash}
                </a>
              )}
            </div>
          )}

          {phase.status === "error" && (
            <p className="mt-6 rounded-2xl bg-red-500/10 p-4 text-red-400">{phase.message}</p>
          )}
        </>
      )}
    </div>
  );
}
