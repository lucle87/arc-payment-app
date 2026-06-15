"use client";

import { useState } from "react";
import ChatPayment from "@/components/ChatPayment";
import RecentPayments from "@/components/RecentPayments";
import HomeStats from "@/components/HomeStats";

export default function Home() {
  // Bumping this re-fetches balance / stats / recent after a successful payment.
  const [refresh, setRefresh] = useState(0);
  const onSent = () => setRefresh((n) => n + 1);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-7xl font-bold mb-6">ARC Payment App</h1>
        <p className="text-zinc-400 text-2xl mb-16">
          AI-powered USDC payments on Arc testnet.
        </p>

        <HomeStats refreshSignal={refresh} />

        <ChatPayment onSent={onSent} />

        <RecentPayments refreshSignal={refresh} />
      </div>
    </main>
  );
}
