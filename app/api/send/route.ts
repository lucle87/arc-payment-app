import { NextRequest, NextResponse } from "next/server";
import { Blockchain } from "@circle-fin/app-kit";
import kit from "@/lib/appkit";
import adapter from "@/lib/adapter";
import fs from "fs";
import path from "path";

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

    // ===== Lưu vào data/transactions.json =====
    const filePath = path.join(process.cwd(), "data", "transactions.json");

    let transactions = [];

    if (fs.existsSync(filePath)) {
      transactions = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );
    }

    transactions.unshift({
      hash: result.txHash,
      address,
      amount,
      memo: "",
      status: "Success",
      time: new Date().toISOString(),
    });

    fs.writeFileSync(
      filePath,
      JSON.stringify(transactions, null, 2)
    );

    return NextResponse.json({
      success: true,
      hash: result.txHash,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}