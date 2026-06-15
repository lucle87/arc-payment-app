import HomeStats from "@/components/HomeStats";

export default function WalletPage() {
  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Wallet</h1>
        <p className="text-zinc-400 text-lg mb-10">Your balance and activity on Arc testnet.</p>
        <HomeStats />
      </div>
    </main>
  );
}
