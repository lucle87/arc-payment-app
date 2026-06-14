import fs from "fs";
import path from "path";
import Link from "next/link";

export default async function AddressPage({
  params,
}: {
  params: Promise<{
    address: string;
  }>;
}) {

  const {
    address,
  } = await params;

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

  const addressTxs =
    transactions.filter(
      (
        tx: any
      ) =>

        tx.address ===
        address

    );

  const totalTx =
    addressTxs.length;

  const totalAmount =
    addressTxs.reduce(

      (
        sum: number,
        tx: any
      ) =>

        sum +
        Number(
          tx.amount
        ),

      0

    );

  const latestMemo =
    totalTx > 0

      ?

      addressTxs[
        addressTxs.length - 1
      ].memo

      :

      "None";

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-10">

        <Link

          href="/explorer"

          className="text-blue-400"

        >

          ← Back

        </Link>

        <h1 className="text-5xl font-bold mt-8 mb-10">

          Address Detail 🟠

        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 rounded-2xl p-8">

            <div className="text-zinc-400 text-sm">

              Total Transactions

            </div>

            <div className="text-5xl font-bold mt-5">

              {totalTx}

            </div>

          </div>

          <div className="bg-zinc-900 rounded-2xl p-8">

            <div className="text-zinc-400 text-sm">

              Total USDC

            </div>

            <div className="text-5xl font-bold mt-5">

              {totalAmount}

            </div>

          </div>

          <div className="bg-zinc-900 rounded-2xl p-8">

            <div className="text-zinc-400 text-sm">

              Latest Memo

            </div>

            <div className="text-orange-500 text-2xl font-bold mt-5">

              {latestMemo}

            </div>

          </div>

        </div>

        <div className="bg-zinc-900 rounded-2xl p-8">

          <h2 className="text-3xl font-bold mb-8">

            Transactions

          </h2>

          <div className="space-y-6">

            {

              addressTxs.map(

                (
                  tx: any,
                  index: number
                ) => (

                  <div

                    key={index}

                    className="border-b border-zinc-800 pb-6"

                  >

                    <div className="text-blue-400 break-all">

                      {tx.hash}

                    </div>

                    <div className="text-orange-500 font-bold mt-3">

                      {tx.memo}

                    </div>

                    <div className="text-zinc-400 mt-3">

                      {tx.amount}

                      {" "}

                      USDC

                    </div>

                  </div>

                )

              )

            }

          </div>

        </div>

      </div>

    </main>

  );

}