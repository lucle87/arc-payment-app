import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type Parsed = { recipient?: string; amount?: string; memo?: string };

function regexParse(text: string): Parsed {
  const amount = text.match(/\d+(\.\d+)?/)?.[0];
  const recipient = text.match(/to\s+([A-Za-z0-9_ ]+?)(?:\s+for\b|$)/i)?.[1]?.trim();
  const memo = text.match(/for\s+(.+)/i)?.[1]?.trim() ?? "";
  return { recipient, amount, memo };
}

async function aiParse(text: string): Promise<Parsed | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `Extract a USDC payment instruction. ` +
            `Reply ONLY with JSON {"recipient": string, "amount": string, "memo": string}. ` +
            `"recipient" is the person's name. "amount" is a numeric string. Use "" if missing.`,
        },
        { role: "user", content: text },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    return JSON.parse(raw) as Parsed;
  } catch (err) {
    console.warn("[/api/ai-send] OpenAI failed, using regex:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ success: false, error: "No text provided" }, { status: 400 });
    }

    const parsed = (await aiParse(text)) ?? regexParse(text);

    if (!parsed.recipient) {
      return NextResponse.json({ success: false, error: "Could not find a recipient" }, { status: 400 });
    }
    const amt = Number(parsed.amount);
    if (!parsed.amount || !Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json({ success: false, error: "Could not find a valid amount" }, { status: 400 });
    }

    // Note: address resolution happens on the client (contacts live in localStorage).
    return NextResponse.json({
      success: true,
      recipient: parsed.recipient,
      amount: String(parsed.amount),
      memo: parsed.memo ?? "",
    });
  } catch (error) {
    console.error("[/api/ai-send] error:", error);
    return NextResponse.json({ success: false, error: "Failed to parse" }, { status: 500 });
  }
}
