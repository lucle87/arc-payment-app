import { NextRequest, NextResponse } from "next/server";
import { contacts } from "@/data/contacts";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    console.log("INPUT:", text);

    // amount
    const amountMatch = text.match(/\d+(\.\d+)?/);
    const amount = amountMatch?.[0];

    // recipient
    const toMatch = text.match(/to\s+([A-Za-z]+)/i);
    const recipient = toMatch?.[1];

    // memo
    const memoMatch = text.match(/for\s+(.+)/i);
    const memo = memoMatch?.[1] ?? "";

    console.log({
      amount,
      recipient,
    });

    if (!recipient) {
      return NextResponse.json({
        success: false,
        error: "Recipient not found",
      });
    }

    const address =
      contacts[recipient as keyof typeof contacts];

    if (!address) {
      return NextResponse.json({
        success: false,
        error: `Contact '${recipient}' not found`,
      });
    }

    return NextResponse.json({
      success: true,
      recipient,
      address,
      amount,
      memo,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
    });
  }
}