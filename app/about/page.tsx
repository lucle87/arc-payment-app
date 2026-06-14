export default function AboutPage() {

  return (

    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8 py-20">

        <h1 className="text-6xl font-bold mb-10">

          About ARC Transaction Explorer 🟠

        </h1>

        <div className="bg-zinc-900 rounded-2xl p-10 space-y-8">

          <p className="text-zinc-300 text-xl">

            ARC Transaction Memo Explorer is an open-source explorer built for ARC Network.

          </p>

          <p className="text-zinc-300 text-xl">

            Features:

          </p>

          <ul className="space-y-4 text-zinc-400">

            <li>
              ✅ Transaction Detail
            </li>

            <li>
              ✅ Address Detail
            </li>

            <li>
              ✅ Search
            </li>

            <li>
              ✅ Sort
            </li>

            <li>
              ✅ Pagination
            </li>

            <li>
              ✅ Leaderboard
            </li>

            <li>
              ✅ Export JSON
            </li>

            <li>
              ✅ Export CSV
            </li>

            <li>
              ✅ Dark Mode
            </li>

          </ul>

          <div className="pt-6">

            <a

              href="https://github.com"

              target="_blank"

              className="bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-xl"

            >

              GitHub

            </a>

          </div>

        </div>

      </div>

    </main>

  );

}