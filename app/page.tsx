"use client";

import { useState } from "react";
import ChatPayment from "@/components/ChatPayment";
import RecentPayments from "@/components/RecentPayments";
import HomeStats from "@/components/HomeStats";

export default function Home() {
  // Bump this after a successful payment to re-fetch balance / stats / recent.
  const [refresh, setRefresh] = useState(0);
  const onSent = () => setRefresh((n) => n + 1);

  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-gradient">
          ARC Payment App
        </h1>
        <p className="text-zinc-400 text-lg md:text-2xl mb-12 md:mb-16">
          AI-powered USDC payments on Arc testnet.
        </p>

        <HomeStats refreshSignal={refresh} />

        <ChatPayment onSent={onSent} />

        <RecentPayments refreshSignal={refresh} />
      </div>
    </main>
  );
}
