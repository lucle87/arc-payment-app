"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPayment() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] =
    useState<Message[]>([]);

  async function handleSend() {
    if (!text || loading) return;

    const userMessage = text;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
      {
        role: "assistant",
        content: "Sending payment... ⏳",
      },
    ]);

    setText("");
    setLoading(true);

    try {
      const aiRes = await fetch(
        "/api/ai-send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            text: userMessage,
          }),
        }
      );

      const aiData =
        await aiRes.json();

      if (!aiData.success) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content:
              aiData.error ??
              "Payment failed ❌",
          },
        ]);

        setLoading(false);
        return;
      }

      const sendRes = await fetch(
        "/api/send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            address:
              aiData.address,
            amount:
              aiData.amount,
          }),
        }
      );

      const sendData =
        await sendRes.json();

      const hash =
        sendData.hash ??
        sendData.result
          ?.transactionHash ??
        "";

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: `Payment successful ✅

Recipient:
${aiData.address}

Amount:
${aiData.amount} USDC

Memo:
${aiData.memo}

Hash:
${hash}`,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            "Payment failed ❌",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="bg-zinc-950 rounded-3xl p-8">

      <h2 className="text-3xl font-bold mb-8">
        AI Wallet ⚡
      </h2>

      <div className="space-y-6 mb-8">

        {messages.map(
          (
            msg,
            index
          ) => (
            <div
              key={index}
              className={
                msg.role ===
                "user"
                  ? "ml-auto max-w-xl bg-orange-500 rounded-2xl p-5"
                  : "max-w-xl bg-zinc-800 rounded-2xl p-5"
              }
            >
              <div className="font-bold mb-2">

                {msg.role ===
                "user"
                  ? "You"
                  : "AI"}

              </div>

              <div className="whitespace-pre-wrap">
                {msg.content}
              </div>

            </div>
          )
        )}

      </div>

      <div className="flex gap-4">

        <input
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          placeholder="Send 5 USDC to Alice for pizza 🍕"
          className="flex-1 bg-zinc-800 rounded-xl px-5 py-4"
        />

        <button
          disabled={loading}
          onClick={handleSend}
          className="bg-orange-500 px-8 rounded-xl"
        >
          {loading
            ? "Sending..."
            : "Send"}
        </button>

      </div>

    </div>
  );
}