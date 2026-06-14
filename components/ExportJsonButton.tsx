"use client";

type Props = {
  transactions: any[];
};

export default function ExportJsonButton({
  transactions,
}: Props) {

  function downloadJson() {

    const json =
      JSON.stringify(
        transactions,
        null,
        2
      );

    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json",
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

    a.href = url;

    a.download =
      "transactions.json";

    a.click();

    URL.revokeObjectURL(
      url
    );

  }

  return (

    <button

      className="bg-orange-500 text-white rounded px-4 py-2"

      onClick={
        downloadJson
      }

    >

      Download JSON

    </button>

  );

}