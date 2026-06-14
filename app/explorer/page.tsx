import fs from "fs";
import path from "path";

import ExplorerClient from "@/components/ExplorerClient";

export default async function ExplorerPage() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "transactions.json"
  );

  const fileData = fs.readFileSync(
    filePath,
    "utf8"
  );

  const transactions = JSON.parse(fileData);

  const totalPayments = transactions.length;

  const totalVolume = transactions.reduce(
    (
      sum: number,
      tx: {
        amount: string;
      }
    ) =>
      sum + Number(tx.amount),
    0
  );

  const successfulPayments = transactions.filter(
    (
      tx: {
        status: string;
      }
    ) =>
      tx.status === "Success"
  ).length;

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="mb-12">

          <h1 className="text-6xl font-bold mb-4">

            Payment History

          </h1>

          <p className="text-zinc-400 text-xl">

            View recent payments made on ARC.

          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="text-zinc-400 mb-2">

              Total Payments

            </div>

            <div className="text-4xl font-bold">

              {totalPayments}

            </div>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="text-zinc-400 mb-2">

              Total Volume

            </div>

            <div className="text-4xl font-bold text-orange-400">

              {totalVolume} USDC

            </div>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

            <div className="text-zinc-400 mb-2">

              Successful Payments

            </div>

            <div className="text-4xl font-bold text-green-400">

              {successfulPayments}

            </div>

          </div>

        </div>

        <ExplorerClient
          transactions={transactions}
        />

      </div>

    </main>
  );
}