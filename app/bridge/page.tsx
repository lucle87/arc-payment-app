"use client";

import { usePrivy } from "@privy-io/react-auth";
import BridgeForm from "@/components/BridgeForm";

export default function BridgePage() {
  const { ready, authenticated, login } = usePrivy();

  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Bridge</h1>
        <p className="text-zinc-400 text-lg mb-10">
          Move USDC across blockchains with Circle CCTP. Burn on the source chain, mint on the destination, all from your wallet.
        </p>

        {ready && !authenticated ? (
          <button onClick={login} className="rounded-xl bg-orange-500 px-7 py-3.5 font-semibold hover:bg-orange-400">
            Log in to bridge
          </button>
        ) : (
          <BridgeForm />
        )}
      </div>
    </main>
  );
}
