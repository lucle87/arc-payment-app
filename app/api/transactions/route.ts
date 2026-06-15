import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";
import {
  getTransactions,
  addTransaction,
  clearTransactions,
  type TxStatus,
} from "@/lib/store";
import { publicClient } from "@/lib/chain";

const HEX_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const HEX_HASH = /^0x[0-9a-fA-F]{64}$/;

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("[/api/transactions GET] error:", error);
    return NextResponse.json({ success: false, error: "Failed to load transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hash, address, amount, memo } = body ?? {};

    if (typeof hash !== "string" || !HEX_HASH.test(hash)) {
      return NextResponse.json({ success: false, error: "Invalid tx hash" }, { status: 400 });
    }
    if (typeof address !== "string" || !HEX_ADDRESS.test(address)) {
      return NextResponse.json({ success: false, error: "Invalid address" }, { status: 400 });
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }

    let status: TxStatus =
      body.status === "Success" || body.status === "Failed" ? body.status : "Pending";
    try {
      const receipt = await publicClient.getTransactionReceipt({ hash: hash as `0x${string}` });
      status = receipt.status === "success" ? "Success" : "Failed";
    } catch {
      // not mined yet
    }

    await addTransaction({
      hash,
      address: getAddress(address.toLowerCase()),
      amount: String(amount),
      memo: typeof memo === "string" ? memo.slice(0, 200) : "",
      timestamp: new Date().toISOString(),
      status,
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("[/api/transactions POST] error:", error);
    return NextResponse.json({ success: false, error: "Failed to save transaction" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearTransactions();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/transactions DELETE] error:", error);
    return NextResponse.json({ success: false, error: "Failed to clear history" }, { status: 500 });
  }
}
