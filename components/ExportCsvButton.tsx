"use client";

type Props = {
  transactions: any[];
};

export default function ExportCsvButton({
  transactions,
}: Props) {

  function downloadCsv() {

    const headers =
      [
        "hash",
        "address",
        "amount",
        "memo",
        "timestamp",
        "status",
      ];

    const rows =
      transactions.map(
        (tx) => [

          tx.hash,

          tx.address,

          tx.amount,

          tx.memo,

          tx.timestamp,

          tx.status,

        ]
      );

    const csv =
      [

        headers.join(","),

        ...rows.map(
          (row) =>
            row.join(",")
        ),

      ].join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href =
      url;

    a.download =
      "transactions.csv";

    a.click();

    URL.revokeObjectURL(
      url
    );

  }

  return (

    <button

      className="bg-green-600 text-white rounded px-4 py-2"

      onClick={
        downloadCsv
      }

    >

      Download CSV

    </button>

  );

}