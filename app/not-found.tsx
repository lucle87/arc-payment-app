import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-8xl font-bold text-orange-500">
          404
        </h1>

        <h2 className="text-4xl font-bold mt-6">
          Page Not Found
        </h2>

        <p className="text-zinc-400 mt-4">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 bg-orange-500 px-6 py-3 rounded-xl"
        >
          Go Home
        </Link>

      </div>
    </main>
  );
}