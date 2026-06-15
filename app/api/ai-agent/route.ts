import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type Payment = { recipient: string; amount: string; memo?: string };

function round2(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

/** Simple fallback when OpenAI isn't configured. */
function regexPlan(text: string, contacts: string[]): Payment[] {
  const lower = text.toLowerCase();
  const amount = Number(text.match(/\d+(\.\d+)?/)?.[0]);
  if (!Number.isFinite(amount) || amount <= 0) return [];

  const memo = text.match(/for\s+(.+)/i)?.[1]?.trim();

  // Which contacts are mentioned?
  let targets = contacts.filter((c) => lower.includes(c.toLowerCase()));
  // "everyone" / "all" -> all contacts
  if (/\b(everyone|all|mọi người|tất cả)\b/i.test(text) && contacts.length) {
    targets = [...contacts];
  }
  if (targets.length === 0) return [];

  const split = /\b(split|share|between|among|chia)\b/i.test(text);
  const each = split ? amount / targets.length : amount;

  return targets.map((name) => ({ recipient: name, amount: round2(each), memo }));
}

async function aiPlan(text: string, contacts: string[]): Promise<Payment[] | null> {
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
            `You plan USDC payments. Known contacts: ${JSON.stringify(contacts)}. ` +
            `Return ONLY JSON {"payments":[{"recipient":string,"amount":string,"memo":string}]}. ` +
            `"recipient" must be one of the known contacts. ` +
            `If the user wants to SPLIT a total among N people, divide equally and round to 2 decimals. ` +
            `If they say "everyone"/"all", include every known contact. ` +
            `Amounts are numeric strings. Use "" for memo when none.`,
        },
        { role: "user", content: text },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.payments) ? parsed.payments : null;
  } catch (err) {
    console.warn("[/api/ai-agent] OpenAI failed, using regex:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, contacts } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ success: false, error: "No text provided" }, { status: 400 });
    }
    const names: string[] = Array.isArray(contacts) ? contacts.filter((c) => typeof c === "string") : [];

    const payments = (await aiPlan(text, names)) ?? regexPlan(text, names);

    const valid = payments.filter(
      (p) => p && p.recipient && Number.isFinite(Number(p.amount)) && Number(p.amount) > 0
    );

    if (valid.length === 0) {
      return NextResponse.json(
        { success: false, error: "Couldn't work out who to pay. Try: \"Split 30 USDC between Alice and Bob\"." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, payments: valid });
  } catch (error) {
    console.error("[/api/ai-agent] error:", error);
    return NextResponse.json({ success: false, error: "Failed to plan payments" }, { status: 500 });
  }
}
