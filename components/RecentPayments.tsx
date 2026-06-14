import transactions from "@/data/transactions.json";

export default function RecentPayments() {
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 mt-12">
      <h2 className="text-3xl font-bold mb-8">
        Recent Payments
      </h2>

      <div className="space-y-5">

        {recent.map((tx: any, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-zinc-800 pb-4"
          >
            <div>
              <div className="font-bold">
                {(tx.address ?? "").slice(0, 8)}
                ...
                {(tx.address ?? "").slice(-6)}
              </div>

              <div className="text-zinc-400 text-sm">
                {tx.timestamp}
              </div>
            </div>

            <div className="text-green-400 font-bold">
              {tx.amount} USDC
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}