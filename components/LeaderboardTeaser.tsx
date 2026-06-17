"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useWallets } from "@privy-io/react-auth";
import Avatar from "./Avatar";

type Row = { rank: number; address: string; txs: number; points: number };
type Data = { top: Row[]; me: Row | null; totalWallets: number; totalTxs: number; totalPoints: number };

const SITE = "https://boarcpay.vercel.app";

function buildShareUrl(me: Row): string {
  const text =
    me.rank > 0
      ? `I'm ranked #${me.rank} on the ARC Payment leaderboard with ${me.points} points 🏆\n\nEvery payment on @arc earns points. Climb the board, top wallets get surprise rewards 🎁\n\nTry it 👇`
      : `I just joined the ARC Payment leaderboard on @arc 🏆\n\nEvery payment earns points. Climb the board, top wallets get surprise rewards 🎁\n\nTry it 👇`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE + "/leaderboard")}`;
}

export default function LeaderboardTeaser() {
  const { wallets } = useWallets();
  const [data, setData] = useState<Data | null>(null);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  useEffect(() => {
    const url = address ? `/api/leaderboard?me=${address}` : `/api/leaderboard`;
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setData(d))
      .catch(() => {});
  }, [address]);

  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
  const medalBg = (r: number) =>
    r === 1
      ? "linear-gradient(135deg,#fde68a,#f59e0b)"
      : r === 2
      ? "linear-gradient(135deg,#e8eef5,#aebfcf)"
      : "linear-gradient(135deg,#e9b486,#c27a3e)";

  const top3 = data?.top.slice(0, 3) ?? [];

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
      <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-b from-orange-500/10 to-transparent p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">🏆 Climb the leaderboard</h2>
            <p className="text-zinc-300">
              Earn 5 points for every payment. Race to the top, top wallets get surprise rewards 🎁
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="self-start rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400 whitespace-nowrap"
          >
            View leaderboard
          </Link>
        </div>

        {top3.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {top3.map((r) => (
              <div key={r.address} className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
                  style={{ background: medalBg(r.rank) }}
                >
                  {r.rank}
                </span>
                <Avatar address={r.address} size={30} />
                <div className="min-w-0">
                  <div className="font-mono text-sm truncate">{short(r.address)}</div>
                  <div className="text-xs font-semibold text-orange-400">{r.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No payments yet. Be the first to top the board.</p>
        )}

        {address && data?.me && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
            <div className="text-sm">
              Your rank:{" "}
              <span className="font-bold text-orange-400">
                {data.me.rank > 0 ? `#${data.me.rank}` : "Unranked"}
              </span>
              <span className="text-zinc-400"> · {data.me.points} points · {data.me.txs} payments</span>
            </div>
            <a
              href={buildShareUrl(data.me)}
              target="_blank"
              rel="noreferrer"
              className="self-start rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold hover:border-orange-500 hover:text-orange-400 transition"
            >
              𝕏 Share my rank
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
