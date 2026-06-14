type Props = {
  transactions: any[];
};

export default function TransactionChart({
  transactions,
}: Props) {

  return (

    <div className="bg-zinc-900 rounded-2xl p-8 shadow">

      <h2 className="text-3xl font-bold mb-8">

        Transactions Chart 📈

      </h2>

      <div className="h-[300px] flex items-center justify-center text-zinc-500">

        No transaction data

      </div>

    </div>

  );

}