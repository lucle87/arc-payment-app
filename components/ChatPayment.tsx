"use client";

import { useState } from "react";

export default function ChatPayment() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);

    setLoading(true);

    try {
      // AI Parse
      const aiRes = await fetch("/api/ai-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
        }),
      });

      const aiData = await aiRes.json();

      if (!aiData.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: aiData.error,
          },
        ]);

        return;
      }

      // Send Payment
      const sendRes = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: aiData.address,
          amount: aiData.amount,
          memo: aiData.memo,
        }),
      });

      const sendData = await sendRes.json();

      if (sendData.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ Payment successful

Recipient: ${aiData.address}

Amount: ${aiData.amount} USDC

Memo: ${aiData.memo}

Hash:

${sendData.hash}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: sendData.error,
          },
        ]);
      }
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

      <h2 className="text-3xl font-bold mb-8">
        Chat Payment
      </h2>

      <div className="space-y-6 mb-8">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={
              msg.role === "user"
                ? "ml-auto max-w-2xl rounded-2xl bg-orange-500 p-4"
                : "max-w-2xl rounded-2xl bg-zinc-900 p-4"
            }
          >

            <div className="mb-2 font-semibold">

              {msg.role === "user"
                ? "You"
                : "AI"}

            </div>

            <div className="whitespace-pre-wrap break-all text-sm">

              {msg.content}

            </div>

          </div>

        ))}

      </div>

      <div className="flex gap-4">

        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Send 5 USDC to Alice for dinner 🍕"
          className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4"
        />

        <button
          disabled={loading}
          onClick={handleSend}
          className="rounded-2xl bg-orange-500 px-8 font-semibold"
        >

          {loading
            ? "..."
            : "Send"}

        </button>

      </div>

    </div>
  );
}