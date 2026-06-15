"use client";

import { useState } from "react";
import SendForm from "@/components/SendForm";
import AISendForm from "@/components/AISendForm";
import BalanceCard from "@/components/BalanceCard";

export default function SendPage() {
  const [refresh, setRefresh] = useState(0);
  const onSent = () => setRefresh((n) => n + 1);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-6xl font-bold mb-4">Send USDC</h1>
        <p className="text-zinc-400 text-xl mb-12">
          Pay a contact manually or just describe it in words.
        </p>

        <div className="mb-10">
          <BalanceCard refreshSignal={refresh} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <SendForm onSent={onSent} />
          <AISendForm onSent={onSent} />
        </div>
      </div>
    </main>
  );
}
