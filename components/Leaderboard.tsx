type Props = {
  transactions: any[];
};

export default function Leaderboard({
  transactions = [],
}: Props) {
  const stats: Record<string, number> = {};

  transactions.forEach((tx) => {
    const address = tx?.address;

    if (!address) return;

    stats[address] = (stats[address] || 0) + 1;
  });

  const topAddresses = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-zinc-900 rounded-2xl p-8 shadow">
      <h2 className="text-3xl font-bold mb-8">
        Top Addresses 🏆
      </h2>

      <div className="space-y-4">
        {topAddresses.map((item, index) => (
          <div
            key={index}
            className="bg-zinc-800 rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <div className="text-zinc-400 text-sm">
                Address
              </div>

              <div className="font-bold">
                {(item[0] ?? "").slice(0, 8)}
                ...
                {(item[0] ?? "").slice(-6)}
              </div>
            </div>

            <div className="text-orange-500 text-2xl font-bold">
              {item[1]} tx
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}