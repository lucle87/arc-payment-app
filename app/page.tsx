import SendForm from "@/components/SendForm";
import AISendForm from "@/components/AISendForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="mb-16">

          <h1 className="text-6xl font-bold mb-6">
            ARC Payment App
          </h1>

          <p className="text-zinc-400 text-xl">
            AI-powered payments built on ARC.
          </p>

        </div>

        {/* Dashboard */}

        <div className="grid md:grid-cols-4 gap-8 mb-16">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="text-zinc-400 mb-2">
              Balance
            </div>

            <div className="text-4xl font-bold text-orange-400">
              125 USDC
            </div>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="text-zinc-400 mb-2">
              Payments
            </div>

            <div className="text-4xl font-bold">
              12
            </div>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="text-zinc-400 mb-2">
              Contacts
            </div>

            <div className="text-4xl font-bold">
              3
            </div>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="text-zinc-400 mb-2">
              Volume
            </div>

            <div className="text-4xl font-bold text-green-400">
              50 USDC
            </div>

          </div>

        </div>

        {/* Send */}

        <div className="mb-16">

          <SendForm />

        </div>

        {/* AI Payment */}

        <AISendForm />

      </div>

    </main>
  );
}