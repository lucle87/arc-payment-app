"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Tx = { amount: string; timestamp?: string };

export default function TransactionChart({
  transactions,
}: {
  transactions: Tx[];
}) {
  // Group volume by calendar day.
  const byDay = new Map<string, number>();
  for (const tx of transactions) {
    const d = tx.timestamp ? new Date(tx.timestamp) : null;
    const key =
      d && !isNaN(d.getTime())
        ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : "—";
    byDay.set(key, (byDay.get(key) ?? 0) + Number(tx.amount || 0));
  }
  const data = [...byDay.entries()].map(([day, volume]) => ({ day, volume }));

  return (
    <div className="bg-zinc-900 rounded-2xl p-8 shadow">
      <h2 className="text-3xl font-bold mb-8">Volume by Day 📈</h2>

      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-zinc-500">
          No transaction data
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                }}
                formatter={(v) => [`${Number(v)} USDC`, "Volume"]}
              />
              <Bar dataKey="volume" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
