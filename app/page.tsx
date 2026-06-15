import Link from "next/link";

const FEATURES: { icon: string; title: string; body: string }[] = [
  {
    icon: "📧",
    title: "Email login, your wallet",
    body: "Sign in with email and a wallet is created for you — no seed phrase, no extension. You hold the keys and can export them anytime.",
  },
  {
    icon: "🤖",
    title: "AI agent payments",
    body: "Describe payments in plain English. The agent can split a bill or pay your whole contact list in one sentence.",
  },
  {
    icon: "⚡",
    title: "Sub-second finality",
    body: "Built on Arc — transactions settle in under a second, so a payment feels instant.",
  },
  {
    icon: "💵",
    title: "Gas paid in USDC",
    body: "No volatile gas token to manage. Fees are tiny and denominated in USDC, so costs stay predictable.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      {/* ===== Hero ===== */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-28 pb-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-300 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400"></span>
            </span>
            Live on Arc testnet
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
            <span className="text-gradient">Pay in USDC</span>
            <br />
            <span className="text-white">by simply typing.</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-2xl mb-8 max-w-2xl">
            A stablecoin wallet that feels like a normal app. Log in with email, get a wallet,
            and send or split USDC with one sentence, settled in under a second on Arc.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/send"
              className="rounded-xl bg-orange-500 px-7 py-3.5 font-semibold hover:bg-orange-400 btn-glow"
            >
              Launch app
            </Link>
            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-zinc-700 px-7 py-3.5 font-semibold text-zinc-200 hover:border-orange-500 hover:text-orange-400 transition"
            >
              💧 Get test USDC
            </a>
          </div>
        </div>
      </section>

      {/* ===== Feature cards ===== */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
