"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useContacts } from "@/lib/useContacts";
import Avatar from "@/components/Avatar";

type Row = { rank: number; address: string; txs: number; points: number };
type Data = {
  top: Row[];
  me: Row | null;
  totalWallets: number;
  totalTxs: number;
  totalPoints: number;
};

const GRID = "grid grid-cols-[44px_1fr_64px_80px] items-center gap-3";
const SITE = "https://boarcpay.vercel.app";

function buildShareUrl(me: Row): string {
  const text =
    me.rank > 0
      ? `I'm ranked #${me.rank} on the ARC Payment leaderboard with ${me.points} points 🏆\n\nEvery payment on @arc earns points. Climb the board, top wallets get surprise rewards 🎁\n\nTry it 👇`
      : `I just joined the ARC Payment leaderboard on @arc 🏆\n\nEvery payment earns points. Climb the board, top wallets get surprise rewards 🎁\n\nTry it 👇`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE + "/leaderboard")}`;
}

export default function LeaderboardPage() {
  const { wallets } = useWallets();
  const { nameByAddress } = useContacts();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  useEffect(() => {
    const url = address ? `/api/leaderboard?me=${address}` : `/api/leaderboard`;
    setLoading(true);
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => d.success && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [address]);

  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
  const medalBg = (rank: number) =>
    rank === 1
      ? "linear-gradient(135deg,#fde68a,#f59e0b)"
      : rank === 2
      ? "linear-gradient(135deg,#e8eef5,#aebfcf)"
      : "linear-gradient(135deg,#e9b486,#c27a3e)";

  const isMe = (a: string) => !!address && a.toLowerCase() === address.toLowerCase();
  const meInTop = data?.me && data.top.some((r) => r.address.toLowerCase() === data.me!.address.toLowerCase());

  function RowItem({ r, me }: { r: Row; me?: boolean }) {
    const name = nameByAddress(r.address);
    return (
      <div className={`${GRID} rounded-2xl border px-4 py-3 ${me ? "border-orange-500/50 bg-orange-500/10" : "border-zinc-800 bg-zinc-950"}`}>
        <div className="text-center font-bold">
          {r.rank >= 1 && r.rank <= 3 ? (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm text-black" style={{ background: medalBg(r.rank) }}>
              {r.rank}
            </span>
          ) : r.rank > 0 ? (
            <span className="text-zinc-400">{r.rank}</span>
          ) : (
            <span className="text-zinc-600">—</span>
          )}
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <Avatar address={r.address} size={30} />
          <div className="min-w-0">
            <div className="font-mono text-sm truncate">{short(r.address)}</div>
            {(me || name) && <div className="text-xs text-orange-300 truncate">{me ? "You" : name}</div>}
          </div>
        </div>
        <div className="text-center text-sm font-semibold text-zinc-300">{r.txs}</div>
        <div className="text-right font-bold text-orange-400">{r.points}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-white px-5 md:px-8 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gradient">Leaderboard</h1>
        <p className="text-zinc-400 text-lg mb-6">
          Top wallets by activity on Arc testnet. Earn 5 points per payment, top wallets get surprise rewards 🎁
        </p>

        {address && data?.me && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
            <div className="text-sm">
              Your rank:{" "}
              <span className="font-bold text-orange-400">{data.me.rank > 0 ? `#${data.me.rank}` : "Unranked"}</span>
              <span className="text-zinc-400"> · {data.me.points} points · {data.me.txs} payments</span>
            </div>
            <a
              href={buildShareUrl(data.me)}
              target="_blank"
              rel="noreferrer"
              className="self-start rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold hover:bg-orange-400"
            >
              𝕏 Share my rank
            </a>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl bg-zinc-900 p-5 text-center">
              <div className="text-2xl font-bold">{data.totalWallets}</div>
              <div className="text-xs text-zinc-400 mt-1">Wallets</div>
            </div>
            <div className="rounded-2xl bg-zinc-900 p-5 text-center">
              <div className="text-2xl font-bold text-orange-400">{data.totalTxs}</div>
              <div className="text-xs text-zinc-400 mt-1">Payments</div>
            </div>
            <div className="rounded-2xl bg-zinc-900 p-5 text-center">
              <div className="text-2xl font-bold text-green-400">{data.totalPoints}</div>
              <div className="text-xs text-zinc-400 mt-1">Total points</div>
            </div>
          </div>
        )}

        <div className={`${GRID} px-4 pb-2 text-xs text-zinc-500`}>
          <div className="text-center">#</div>
          <div>Wallet</div>
          <div className="text-center">Txs</div>
          <div className="text-right">Points</div>
        </div>

        {loading ? (
          <p className="px-4 text-zinc-500">Loading…</p>
        ) : !data || data.top.length === 0 ? (
          <p className="px-4 text-zinc-500">No payments yet. Be the first to earn points.</p>
        ) : (
          <div className="space-y-2">
            {data.top.map((r) => (
              <RowItem key={r.address} r={r} me={isMe(r.address)} />
            ))}
            {data.me && !meInTop && (
              <>
                <div className="py-1 text-center text-zinc-600">· · ·</div>
                <RowItem r={data.me} me />
              </>
            )}
          </div>
        )}

        {!address && <p className="mt-6 text-center text-sm text-zinc-500">Log in to see your rank and share it.</p>}
      </div>
    </main>
  );
}
