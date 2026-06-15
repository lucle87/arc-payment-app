import Link from "next/link";
import { getTransactions } from "@/lib/store";
import { contactName } from "@/lib/contacts";

export const dynamic = "force-dynamic";

export default async function AddressPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const all = await getTransactions();
  const addressTxs = all.filter(
    (tx) => (tx.address ?? "").toLowerCase() === address.toLowerCase()
  );

  const totalTx = addressTxs.length;
  const totalAmount = addressTxs.reduce(
    (sum, tx) => sum + Number(tx.amount || 0),
    0
  );
  const latestMemo = totalTx > 0 ? addressTxs[0].memo || "None" : "None";
  const name = contactName(address);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <Link href="/explorer" className="text-blue-400">
          ← Back
        </Link>

        <h1 className="text-5xl font-bold mt-8 mb-2">Address Detail 🟠</h1>
        <p className="text-zinc-500 break-all mb-10">
          {name ? `${name} · ` : ""}
          {address}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card label="Total Transactions" value={totalTx} />
          <Card label="Total USDC" value={totalAmount} />
          <Card label="Latest Memo" value={latestMemo} accent />
        </div>

        <div className="bg-zinc-900 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-8">Transactions</h2>
          {addressTxs.length === 0 ? (
            <p className="text-zinc-500">No transactions for this address.</p>
          ) : (
            <div className="space-y-6">
              {addressTxs.map((tx, index) => (
                <Link
                  key={tx.hash || index}
                  href={`/explorer/${tx.hash}`}
                  className="block border-b border-zinc-800 pb-6 hover:opacity-80"
                >
                  <div className="text-blue-400 break-all">{tx.hash}</div>
                  {tx.memo && (
                    <div className="text-orange-500 font-bold mt-3">
                      {tx.memo}
                    </div>
                  )}
                  <div className="text-zinc-400 mt-3">{tx.amount} USDC</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Card({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-8">
      <div className="text-zinc-400 text-sm">{label}</div>
      <div
        className={`mt-5 font-bold ${
          accent ? "text-2xl text-orange-500" : "text-5xl"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
