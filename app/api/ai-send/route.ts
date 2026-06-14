import { NextRequest, NextResponse } from "next/server";

const contacts = [
  {
    name: "alice",
    address:
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
  {
    name: "bob",
    address:
      "0x1234567890123456789012345678901234567890",
  },
  {
    name: "charlie",
    address:
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const text = body.text.toLowerCase();

    const amountMatch =
      text.match(/\d+(\.\d+)?/);

    const amount =
      amountMatch?.[0] || "1";

    const contact = contacts.find(
      (c) =>
        text.includes(c.name)
    );

    if (!contact) {
      return NextResponse.json({
        success: false,
        error: "Contact not found",
      });
    }

    let memo = "";

    const forIndex =
      text.indexOf("for");

    if (forIndex !== -1) {
      memo = body.text.substring(
        forIndex + 4
      );
    }

    return NextResponse.json({
      success: true,

      address:
        contact.address,

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