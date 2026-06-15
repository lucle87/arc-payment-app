"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSendUsdc } from "@/lib/useSendUsdc";

type Message = { role: "user" | "assistant"; content: string; hash?: string };
type Pending = { recipient: string; address: string; amount: string; memo: string };

export default function ChatPayment({ onSent }: { onSent?: () => void }) {
  const { authenticated, login } = usePrivy();
  const { send } = useSendUsdc();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);

  function push(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }
  function replaceLast(msg: Message) {
    setMessages((prev) => [...prev.slice(0, -1), msg]);
  }

  async function handleParse() {
    if (!text.trim() || loading) return;
    if (!authenticated) {
      login();
      return;
    }
    const userMessage = text;
    setText("");
    setLoading(true);
    push({ role: "user", content: userMessage });
    push({ role: "assistant", content: "Reading your request… ⏳" });

    try {
      const res = await fetch("/api/ai-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage }),
      });
      const ai = await res.json();
      if (!ai.success) {
        replaceLast({ role: "assistant", content: ai.error ?? "Couldn't understand that ❌" });
        return;
      }
      setPending({
        recipient: ai.recipient,
        address: ai.address,
        amount: ai.amount,
        memo: ai.memo ?? "",
      });
      replaceLast({
        role: "assistant",
        content:
          `Please confirm:\n\n` +
          `Recipient: ${ai.recipient}\n` +
          `Amount: ${ai.amount} USDC` +
          (ai.memo ? `\nMemo: ${ai.memo}` : ""),
      });
    } catch {
      replaceLast({ role: "assistant", content: "Network error ❌" });
    } finally {
      setLoading(false);
    }
  }

  async function confirmSend() {
    if (!pending) return;
    const p = pending;
    setPending(null);
    setLoading(true);
    push({ role: "assistant", content: `Sending ${p.amount} USDC to ${p.recipient}… ⏳` });
    try {
      const { hash, status } = await send({
        to: p.address,
        amount: p.amount,
        memo: p.memo,
      });
      replaceLast({
        role: "assistant",
        hash,
        content:
          `Payment ${status === "Success" ? "confirmed ✅" : "submitted ⏳"}\n\n` +
          `Recipient: ${p.recipient}\n` +
          `Amount: ${p.amount} USDC` +
          (p.memo ? `\nMemo: ${p.memo}` : ""),
      });
      onSent?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment failed ❌";
      replaceLast({ role: "assistant", content: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
      <h2 className="text-3xl font-bold mb-8">AI Wallet ⚡</h2>

      <div className="space-y-6 mb-8">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? "ml-auto max-w-xl bg-orange-500 rounded-2xl p-5"
                : "max-w-xl bg-zinc-800 rounded-2xl p-5"
            }
          >
            <div className="font-bold mb-2">{msg.role === "user" ? "You" : "AI"}</div>
            <div className="whitespace-pre-wrap">{msg.content}</div>
            {msg.hash && (
              <a
                href={`/explorer/${msg.hash}`}
                className="mt-3 inline-block text-sm text-blue-300 break-all underline"
              >
                View transaction →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation step */}
      {pending && (
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              setPending(null);
              push({ role: "assistant", content: "Cancelled." });
            }}
            className="flex-1 rounded-xl border border-zinc-700 py-3"
          >
            Cancel
          </button>
          <button
            onClick={confirmSend}
            disabled={loading}
            className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold disabled:opacity-40"
          >
            Confirm &amp; Send
          </button>
        </div>
      )}

      {!authenticated ? (
        <button
          onClick={login}
          className="w-full bg-orange-500 rounded-xl py-4 font-semibold"
        >
          Login to send
        </button>
      ) : (
        <div className="flex gap-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            placeholder="Send 0.1 USDC to Alice for pizza 🍕"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 outline-none"
            disabled={loading || !!pending}
          />
          <button
            disabled={loading || !!pending}
            onClick={handleParse}
            className="bg-orange-500 px-8 rounded-xl font-semibold disabled:opacity-40"
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}
