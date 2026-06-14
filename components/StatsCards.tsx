type Props = {
  totalTx: number;
  totalAmount: number;
  latestMemo: string;
};

export default function StatsCards({
  totalTx,
  totalAmount,
  latestMemo,
}: Props) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

      <div className="bg-zinc-900 rounded-2xl p-8 shadow">

        <div className="text-zinc-400 text-sm">

          Total Transactions

        </div>

        <div className="text-5xl font-bold mt-5">

          {totalTx}

        </div>

      </div>

      <div className="bg-zinc-900 rounded-2xl p-8 shadow">

        <div className="text-zinc-400 text-sm">

          Total USDC Sent

        </div>

        <div className="text-5xl font-bold mt-5">

          {totalAmount}

        </div>

      </div>

      <div className="bg-zinc-900 rounded-2xl p-8 shadow">

        <div className="text-zinc-400 text-sm">

          Latest Memo

        </div>

        <div className="text-2xl text-orange-500 font-bold mt-5">

          {latestMemo}

        </div>

      </div>

    </div>

  );

}