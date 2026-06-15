"use client";

type Tx = Record<string, unknown>;

// Escape a value for CSV: quote if needed, double internal quotes, and neutralize
// formula-injection (cells starting with = + - @ are prefixed with ').
function csvCell(value: unknown): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function ExportCsvButton({ transactions }: { transactions: Tx[] }) {
  function downloadCsv() {
    const headers = ["hash", "address", "amount", "memo", "timestamp", "status"];
    const rows = transactions.map((tx) =>
      headers.map((h) => csvCell((tx as Record<string, unknown>)[h])).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={downloadCsv}
      className="bg-green-600 hover:bg-green-500 text-white rounded-xl px-4 py-2"
    >
      Download CSV
    </button>
  );
}
