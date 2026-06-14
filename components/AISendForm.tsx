"use client";

import { useState } from "react";

export default function AISendForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      // AI parse
      const aiRes = await fetch("/api/ai-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      const aiData = await aiRes.json();

      if (!aiData.success) {
        alert(aiData.error);
        return;
      }

      // Send USDC
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
        setHash(sendData.hash);
      } else {
        alert(sendData.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

      <h2 className="text-3xl font-bold mb-6">
        AI Payment
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <textarea
          rows={4}
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Send 5 USDC to Alice for dinner 🍕"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-orange-500 py-3 font-semibold"
        >
          {loading
            ? "Sending..."
            : "Send with AI"}
        </button>

      </form>

      {hash && (
        <div className="mt-8">

          <p className="text-green-400">
            Success!
          </p>

          <p className="break-all text-sm text-zinc-400">
            {hash}
          </p>

        </div>
      )}

    </div>
  );
}