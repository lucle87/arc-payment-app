import ExplorerClient from "@/components/ExplorerClient";
import { getTransactions } from "@/lib/store";

export const dynamic = "force-dynamic"; // always reflect the latest sends

export default async function ExplorerPage() {
  const transactions = await getTransactions();

  const totalPayments = transactions.length;
  const totalVolume = transactions.reduce(
    (sum, tx) => sum + Number(tx.amount || 0),
    0
  );
  const successfulPayments = transactions.filter(
    (tx) => tx.status === "Success"
  ).length;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4">Payment History</h1>
          <p className="text-zinc-400 text-xl">
            Payments made on Arc testnet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Stat label="Total Payments" value={totalPayments} />
          <Stat
            label="Total Volume"
            value={`${totalVolume.toFixed(2)} USDC`}
            accent="text-orange-400"
          />
          <Stat
            label="Successful"
            value={successfulPayments}
            accent="text-green-400"
          />
        </div>

        <ExplorerClient transactions={transactions} />
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent = "",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <div className="text-zinc-400 mb-2">{label}</div>
      <div className={`text-4xl font-bold ${accent}`}>{value}</div>
    </div>
  );
}
