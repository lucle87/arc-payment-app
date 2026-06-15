"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "./WalletButton";

const LINKS: [string, string][] = [
  ["/", "Home"],
  ["/send", "Send"],
  ["/explorer", "History"],
  ["/contacts", "Contacts"],
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-800/70 bg-black/55 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2 flex items-center justify-between gap-4">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="ARC" className="h-16 md:h-20 w-auto object-contain" />
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-orange-400">ARC</span>{" "}
            <span className="text-white">Payment</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-7 text-sm">
          {LINKS.map(([href, label]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={active ? "text-orange-400 font-medium" : "text-zinc-400 hover:text-white transition"}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Faucet + wallet */}
        <div className="flex items-center gap-3">
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 hover:border-orange-500 hover:text-orange-400 transition"
          >
            💧 Faucet
          </a>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
