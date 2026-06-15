import { NextResponse } from "next/server";
import { getUsdcBalance } from "@/lib/chain";
import { senderAddress } from "@/lib/adapter";

// Read the live on-chain USDC balance of the app wallet.
export async function GET() {
  try {
    if (!senderAddress) {
      return NextResponse.json(
        { success: false, error: "Wallet not configured" },
        { status: 500 }
      );
    }
    const balance = await getUsdcBalance(senderAddress);
    return NextResponse.json({ success: true, address: senderAddress, balance });
  } catch (error) {
    console.error("[/api/balance] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read balance" },
      { status: 500 }
    );
  }
}
