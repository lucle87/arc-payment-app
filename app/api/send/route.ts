import { NextRequest, NextResponse } from "next/server";
import kit from "@/lib/appkit";
import { adapter } from "@/lib/adapter";
import { Blockchain } from "@circle-fin/adapter-viem-v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const address = body.address;
    const amount = body.amount;

    const result = await kit.send({
      from: {
        adapter,
        chain: Blockchain.Arc_Testnet,
      },
      to: address,
      amount,
      token: "USDC",
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}