type Transaction = {
  hash?: string;
  address?: string;
  amount?: string;
  memo?: string;
  status?: string;
  time?: string;
  timestamp?: string;
};

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr className="text-left text-zinc-400">
              <th className="px-6 py-5">Recipient</th>
              <th className="px-6 py-5">Amount</th>
              <th className="px-6 py-5">Memo</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Hash</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={tx.hash ?? index}
                className="border-b border-zinc-800 hover:bg-zinc-900"
              >
                <td className="px-6 py-5">
                  <div className="font-medium">
                    {(tx.address ?? "").slice(0, 8)}
                    ...
                    {(tx.address ?? "").slice(-6)}
                  </div>
                </td>

                <td className="px-6 py-5 font-semibold text-orange-400">
                  {tx.amount ?? "0"} USDC
                </td>

                <td className="px-6 py-5 text-zinc-300">
                  {tx.memo || "-"}
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                    {tx.status ?? "Success"}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm text-zinc-500">
                  {(tx.hash ?? "").slice(0, 10)}
                  ...
                  {(tx.hash ?? "").slice(-8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}