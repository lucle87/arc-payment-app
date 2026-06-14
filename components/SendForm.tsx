"use client";

import { useState } from "react";

const contacts = [
  {
    name: "Alice",
    address:
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
  {
    name: "Bob",
    address:
      "0x1234567890123456789012345678901234567890",
  },
  {
    name: "Charlie",
    address:
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  },
];

export default function SendForm() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          amount,
          memo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setHash(data.hash);
      } else {
        alert(data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">

      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

        <h2 className="text-3xl font-bold mb-8">

          Send Payment

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 text-zinc-400">

              Recipient

            </label>

            <select
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            >

              <option value="">
                Select contact
              </option>

              {contacts.map((contact) => (

                <option
                  key={contact.address}
                  value={contact.address}
                >

                  {contact.name}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block mb-2 text-zinc-400">

              Amount

            </label>

            <input
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="1"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 text-zinc-400">

              Memo

            </label>

            <textarea
              rows={4}
              value={memo}
              onChange={(e) =>
                setMemo(e.target.value)
              }
              placeholder="Dinner 🍕"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            />

          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold"
          >

            {loading
              ? "Sending..."
              : "Send USDC"}

          </button>

        </form>

        {hash && (

          <div className="mt-8 rounded-2xl bg-zinc-900 p-4">

            <p className="text-zinc-400 mb-2">

              Transaction Hash

            </p>

            <p className="break-all text-sm text-green-400">

              {hash}

            </p>

          </div>

        )}

      </div>

    </div>
  );
}