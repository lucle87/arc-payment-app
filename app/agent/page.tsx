"use client";

import { useState } from "react";
import AgentPayment from "@/components/AgentPayment";

export default function AgentPage() {
  const [, setRefresh] = useState(0);
  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">AI Agent</h1>
        <p className="text-zinc-400 text-lg mb-10">
          Describe a batch of payments in one sentence — the agent splits and sends them on Arc.
        </p>
        <AgentPayment onSent={() => setRefresh((n) => n + 1)} />
      </div>
    </main>
  );
}
