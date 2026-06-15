import Link from "next/link";

type Transaction = {
  hash?: string;
  address?: string;
  amount?: string;
  memo?: string;
  status?: string;
  timestamp?: string;
};

function statusClasses(status?: string) {
  switch (status) {
    case "Success":
      return "bg-green-500/20 text-green-400";
    case "Failed":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-yellow-500/20 text-yellow-400";
  }
}

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
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                  No transactions
                </td>
              </tr>
            )}
            {transactions.map((tx, index) => (
              <tr
                key={tx.hash ?? index}
                className="border-b border-zinc-800 hover:bg-zinc-900"
              >
                <td className="px-6 py-5">
                  {tx.address ? (
                    <Link
                      href={`/address/${tx.address}`}
                      className="font-medium hover:text-orange-400"
                    >
                      {tx.address.slice(0, 8)}…{tx.address.slice(-6)}
                    </Link>
                  ) : (
                    <span className="text-zinc-500">—</span>
                  )}
                </td>
                <td className="px-6 py-5 font-semibold text-orange-400">
                  {tx.amount ?? "0"} USDC
                </td>
                <td className="px-6 py-5 text-zinc-300">{tx.memo || "-"}</td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${statusClasses(
                      tx.status
                    )}`}
                  >
                    {tx.status ?? "Pending"}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-zinc-500">
                  {tx.hash ? (
                    <Link
                      href={`/explorer/${tx.hash}`}
                      className="hover:text-blue-400"
                    >
                      {tx.hash.slice(0, 10)}…{tx.hash.slice(-8)}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
