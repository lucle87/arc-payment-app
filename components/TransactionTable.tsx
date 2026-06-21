"use client";

import Avatar from "./Avatar";

type Tx = {
  hash: string;
  address: string;
  amount: string;
  token?: string;
  memo?: string;
  status: string;
  timestamp?: string;
  memoId?: string;
  onchainMemo?: boolean;
};

function shortAddr(a?: string) {
  if (!a) return "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
function shortHash(h?: string) {
  if (!h) return "";
  return `${h.slice(0, 8)}…${h.slice(-6)}`;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Success: "bg-green-500/15 text-green-400",
    Pending: "bg-yellow-500/15 text-yellow-400",
    Failed: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${map[status] ?? "bg-zinc-700/40 text-zinc-300"}`}>
      {status}
    </span>
  );
}

export default function TransactionTable({ transactions }: { transactions: Tx[] }) {
  if (!transactions.length) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-500">
        No transactions
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-800 text-sm text-zinc-400">
            <th className="p-5 font-medium">Recipient</th>
            <th className="p-5 font-medium">Amount</th>
            <th className="p-5 font-medium">Memo</th>
            <th className="p-5 font-medium">Status</th>
            <th className="p-5 font-medium">Hash</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={tx.hash || i} className="border-b border-zinc-900/80 hover:bg-zinc-900/40">
              <td className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar address={tx.address} size={28} />
                  <span className="font-mono text-sm">{shortAddr(tx.address)}</span>
                </div>
              </td>
              <td className="p-5 font-semibold text-orange-400">
                {tx.amount} {tx.token ?? "USDC"}
              </td>
              <td className="p-5 text-sm text-zinc-400">
                {tx.memo || tx.onchainMemo ? (
                  <span className="inline-flex items-center gap-2">
                    <span>{tx.memo || "—"}</span>
                    {tx.onchainMemo && (
                      <span
                        title="Stored on-chain via Arc Memo contract"
                        className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-medium text-orange-300"
                      >
                        ⛓ on-chain
                      </span>
                    )}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="p-5"><StatusPill status={tx.status} /></td>
              <td className="p-5">
                <a href={`/explorer/${tx.hash}`} className="font-mono text-xs text-zinc-500 hover:text-orange-400">
                  {shortHash(tx.hash)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
