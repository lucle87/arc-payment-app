import fs from "fs";
import path from "path";
import Link from "next/link";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {

  const { hash } =
    await params;

  const filePath =
    path.join(
      process.cwd(),
      "data",
      "transactions.json"
    );

  const fileData =
    fs.readFileSync(
      filePath,
      "utf8"
    );

  const transactions =
    JSON.parse(
      fileData
    );

  const tx =
    transactions.find(
      (t: any) =>
        t.hash === hash
    );

  if (!tx) {

    return (

      <main className="min-h-screen bg-black text-white p-10">

        Transaction not found

      </main>

    );

  }

  return (

    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto">

        <Link

          href="/explorer"

          className="text-blue-400"

        >

          ← Back

        </Link>

        <h1 className="text-5xl font-bold mt-8 mb-10">

          Transaction Detail 🟠

        </h1>

        <div className="bg-zinc-900 rounded-2xl p-8 space-y-8 shadow">

          <div>

            <h2 className="text-zinc-400 mb-2">

              Hash

            </h2>

            <p className="break-all">

              {tx.hash}

            </p>

          </div>

          <div>

            <h2 className="text-zinc-400 mb-2">

              Address

            </h2>

            <p>

              {tx.address}

            </p>

          </div>

          <div>

            <h2 className="text-zinc-400 mb-2">

              Amount

            </h2>

            <p>

              {tx.amount}

              {" "}

              USDC

            </p>

          </div>

          <div>

            <h2 className="text-zinc-400 mb-2">

              Memo

            </h2>

            <p className="text-orange-500 font-bold">

              {tx.memo}

            </p>

          </div>

          <div>

            <h2 className="text-zinc-400 mb-2">

              Timestamp

            </h2>

            <p>

              {

                tx.timestamp ||

                "-"

              }

            </p>

          </div>

          <div>

            <h2 className="text-zinc-400 mb-2">

              Status

            </h2>

            <p className="text-green-500 font-bold">

              {

                tx.status ||

                "Success"

              }

            </p>

          </div>

        </div>

      </div>

    </main>

  );

}