import ChatPayment from "@/components/ChatPayment";
import RecentPayments from "@/components/RecentPayments";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-7xl font-bold mb-6">
          ARC Payment App
        </h1>

        <p className="text-zinc-400 text-2xl mb-16">
          AI-powered payments built on ARC.
        </p>

        <div className="grid md:grid-cols-4 gap-8 mb-16">

          <div className="bg-zinc-900 rounded-3xl p-8">
            <div className="text-zinc-400 mb-2">
              Balance
            </div>

            <div className="text-4xl font-bold text-orange-400">
              125 USDC
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8">
            <div className="text-zinc-400 mb-2">
              Payments
            </div>

            <div className="text-4xl font-bold">
              12
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8">
            <div className="text-zinc-400 mb-2">
              Contacts
            </div>

            <div className="text-4xl font-bold">
              3
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-8">
            <div className="text-zinc-400 mb-2">
              Volume
            </div>

            <div className="text-4xl font-bold text-green-400">
              50 USDC
            </div>
          </div>

        </div>

        <ChatPayment />

        <RecentPayments />

      </div>
    </main>
  );
}