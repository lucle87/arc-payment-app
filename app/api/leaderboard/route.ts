import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";
import { getTransactions } from "@/lib/store";

const HEX = /^0x[0-9a-fA-F]{40}$/;
const POINTS_PER_TX = 5;

type Row = { rank: number; address: string; txs: number; points: number };

export async function GET(req: NextRequest) {
  try {
    const meParam = req.nextUrl.searchParams.get("me");

    const all = await getTransactions(); // all wallets, newest first
    const counts = new Map<string, number>();
    let totalTxs = 0;
    for (const t of all) {
      if (!t.owner || t.status === "Failed") continue;
      counts.set(t.owner, (counts.get(t.owner) ?? 0) + 1);
      totalTxs++;
    }

    const ranked: Row[] = [...counts.entries()]
      .map(([address, txs]) => ({ address, txs, points: txs * POINTS_PER_TX, rank: 0 }))
      .sort((a, b) => b.points - a.points || a.address.localeCompare(b.address));
    ranked.forEach((r, i) => (r.rank = i + 1));

    const top = ranked.slice(0, 20);

    let me: Row | null = null;
    if (meParam && HEX.test(meParam)) {
      const addr = getAddress(meParam.toLowerCase());
      const found = ranked.find((r) => r.address.toLowerCase() === addr.toLowerCase());
      me = found ?? { rank: 0, address: addr, txs: 0, points: 0 };
    }

    return NextResponse.json({
      success: true,
      top,
      me,
      totalWallets: ranked.length,
      totalTxs,
      totalPoints: totalTxs * POINTS_PER_TX,
      pointsPerTx: POINTS_PER_TX,
    });
  } catch (e) {
    console.error("[/api/leaderboard]", e);
    return NextResponse.json({ success: false, error: "Failed to load leaderboard" }, { status: 500 });
  }
}
