"use client";

import { usePrivy } from "@privy-io/react-auth";
import HomeStats from "@/components/HomeStats";

export default function WalletPage() {
  const { ready, authenticated, login } = usePrivy();

  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Wallet</h1>
        <p className="text-zinc-400 text-lg mb-10">Your balance and activity on Arc testnet.</p>

        {!ready ? null : !authenticated ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center">
            <p className="text-zinc-400 mb-5">Log in to view your wallet.</p>
            <button onClick={login} className="rounded-xl bg-orange-500 px-7 py-3 font-semibold hover:bg-orange-400">
              Login
            </button>
          </div>
        ) : (
          <HomeStats />
        )}
      </div>
    </main>
  );
}
