"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import WalletButton from "./WalletButton";

const PRIMARY: [string, string][] = [
  ["/wallet", "Wallet"],
  ["/send", "Send"],
  ["/receive", "Receive"],
  ["/agent", "AI Agent"],
];

// Secondary items live under the "More" menu.
const MORE: [string, string][] = [
  ["/explorer", "History"],
  ["/leaderboard", "Leaderboard"],
  ["/contacts", "Contacts"],
  // ["/bridge", "Bridge"], // re-enable when bridge works
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const moreActive = MORE.some(([href]) => pathname === href);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-800/70 bg-black/55 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.png" alt="BoPay" className="h-14 md:h-16 w-auto object-contain" />
          <span className="text-lg md:text-xl font-bold tracking-tight">
            <span className="text-orange-400">Bo</span><span className="text-white">Pay</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-5 text-sm">
          {PRIMARY.map(([href, label]) => {
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

          {/* More dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex items-center gap-1 transition ${
                moreActive || open ? "text-orange-400 font-medium" : "text-zinc-400 hover:text-white"
              }`}
            >
              More
              <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-zinc-800 bg-[#18181b] p-2 shadow-xl z-[100]">
                {MORE.map(([href, label]) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`block rounded-xl px-3 py-2 text-sm transition ${
                        active ? "bg-orange-500/15 text-orange-400" : "text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://faucet.circle.com"
            target="_blank"
            rel="noreferrer"
            className="hidden xl:inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 hover:border-orange-500 hover:text-orange-400 transition"
          >
            💧 Faucet
          </a>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
