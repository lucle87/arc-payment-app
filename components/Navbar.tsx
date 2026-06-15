"use client";

import Link from "next/link";
import WalletButton from "./WalletButton";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <Link
          href="/"
          className="text-2xl font-bold text-orange-400"
        >
          ARC Payment App
        </Link>

        <div className="flex items-center gap-8 text-zinc-300">

          <Link
            href="/"
            className="hover:text-white transition"
          >
            Home
          </Link>

          <Link
            href="/send"
            className="hover:text-white transition"
          >
            Send
          </Link>

          <Link
            href="/explorer"
            className="hover:text-white transition"
          >
            History
          </Link>

          <Link
            href="/contacts"
            className="hover:text-white transition"
          >
            Contacts
          </Link>

          {/* Login / wallet button */}
          <WalletButton />

        </div>

      </div>
    </nav>
  );
}
