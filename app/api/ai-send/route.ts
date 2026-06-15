import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { contacts, resolveContact } from "@/lib/contacts";

type Parsed = { recipient?: string; amount?: string; memo?: string };

/** Deterministic fallback. Used when OpenAI is unavailable OR throws. */
function regexParse(text: string): Parsed {
  const amount = text.match(/\d+(\.\d+)?/)?.[0];
  const recipient = text.match(/to\s+([A-Za-z]+)/i)?.[1];
  const memo = text.match(/for\s+(.+)/i)?.[1]?.trim() ?? "";
  return { recipient, amount, memo };
}

/** Real natural-language parsing via OpenAI. Returns null if key missing or it fails. */
async function aiParse(text: string): Promise<Parsed | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new OpenAI({ apiKey });
    const names = contacts.map((c) => c.name).join(", ");

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `You extract a USDC payment instruction from a sentence. ` +
            `Known contacts: ${names}. ` +
            `Reply ONLY with JSON: {"recipient": string, "amount": string, "memo": string}. ` +
            `"amount" is a numeric string. Use "" for any missing field.`,
        },
        { role: "user", content: text },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    return JSON.parse(raw) as Parsed;
  } catch (err) {
    // Don't fail the request just because OpenAI errored (bad key, quota, network).
    // Log it and let the caller fall back to regex.
    console.warn("[/api/ai-send] OpenAI parse failed, using regex fallback:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "No text provided" },
        { status: 400 }
      );
    }

    const parsed = (await aiParse(text)) ?? regexParse(text);
    console.log("[/api/ai-send] parsed =", JSON.stringify(parsed));

    if (!parsed.recipient) {
      return NextResponse.json(
        { success: false, error: "Could not find a recipient in your message" },
        { status: 400 }
      );
    }

    const contact = resolveContact(parsed.recipient);
    if (!contact) {
      return NextResponse.json(
        { success: false, error: `Contact '${parsed.recipient}' not found` },
        { status: 404 }
      );
    }

    const amt = Number(parsed.amount);
    if (!parsed.amount || !Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json(
        { success: false, error: "Could not find a valid amount" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      recipient: contact.name,
      address: contact.address,
      amount: String(parsed.amount),
      memo: parsed.memo ?? "",
    });
  } catch (error) {
    console.error("[/api/ai-send] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse your message" },
      { status: 500 }
    );
  }
}