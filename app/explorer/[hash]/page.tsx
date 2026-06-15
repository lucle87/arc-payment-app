import Link from "next/link";
import type { ReactNode } from "react";
import { getTransactions } from "@/lib/store";
import { explorerTxUrl } from "@/lib/chain";
import { contactName } from "@/lib/contacts";

export const dynamic = "force-dynamic";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const transactions = await getTransactions();
  const tx = transactions.find((t) => t.hash === hash);

  if (!tx) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/explorer" className="text-blue-400">
            ← Back
          </Link>
          <p className="mt-8 text-zinc-400">Transaction not found.</p>
        </div>
      </main>
    );
  }

  const rows: [string, ReactNode][] = [
    ["Hash", <span className="break-all">{tx.hash}</span>],
    [
      "Recipient",
      <span className="break-all">
        {contactName(tx.address) ? `${contactName(tx.address)} · ` : ""}
        {tx.address}
      </span>,
    ],
    ["Amount", `${tx.amount} USDC`],
    ["Memo", tx.memo || "—"],
    ["Timestamp", tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "—"],
    ["Status", tx.status],
  ];

  const external = explorerTxUrl(tx.hash);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/explorer" className="text-blue-400">
          ← Back
        </Link>

        <h1 className="text-5xl font-bold mt-8 mb-10">Transaction Detail 🟠</h1>

        <div className="bg-zinc-900 rounded-2xl p-8 space-y-6 shadow">
          {rows.map(([label, value]) => (
            <div key={label}>
              <h2 className="text-zinc-400 mb-2">{label}</h2>
              <p
                className={
                  label === "Memo"
                    ? "text-orange-500 font-bold"
                    : label === "Status"
                    ? "font-bold"
                    : ""
                }
              >
                {value}
              </p>
            </div>
          ))}

          {external && (
            <a
              href={external}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-blue-400 underline"
            >
              View on Arc explorer →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
