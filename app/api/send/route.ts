import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";
import { Blockchain } from "@circle-fin/adapter-viem-v2";
import fs from "fs/promises";
import path from "path";
import kit from "@/lib/appkit";
import { adapter } from "@/lib/adapter";
import { publicClient } from "@/lib/chain";
import { addTransaction, updateStatus } from "@/lib/store";
import { contactName, resolveContact } from "@/lib/contacts";

const MAX_AMOUNT = Number(process.env.MAX_SEND_AMOUNT ?? "100");
const HEX_ADDRESS = /^0x[0-9a-fA-F]{40}$/;

function normalizeAddress(value: string): `0x${string}` | null {
  if (!HEX_ADDRESS.test(value)) return null;
  try {
    return getAddress(value.toLowerCase());
  } catch {
    return null;
  }
}

function extractHash(obj: unknown): string {
  const HASH = /^0x[0-9a-fA-F]{64}$/;
  const seen = new Set<unknown>();
  function walk(v: unknown): string | null {
    if (typeof v === "string") return HASH.test(v) ? v : null;
    if (v && typeof v === "object") {
      if (seen.has(v)) return null;
      seen.add(v);
      const o = v as Record<string, unknown>;
      for (const k of ["transactionHash", "hash", "txHash", "transaction_hash"]) {
        const val = o[k];
        if (typeof val === "string" && HASH.test(val)) return val;
      }
      for (const val of Object.values(o)) {
        const found = walk(val);
        if (found) return found;
      }
    }
    return null;
  }
  return walk(obj) ?? "";
}

// Safely turn the SDK result into JSON (handles BigInt etc.).
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(
      value,
      (_k, v) => (typeof v === "bigint" ? v.toString() + "n" : v),
      2
    );
  } catch (e) {
    return `<<could not stringify: ${String(e)}>>\nkeys: ${
      value && typeof value === "object" ? Object.keys(value).join(", ") : typeof value
    }`;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SEND_SECRET;
  if (secret && req.headers.get("x-send-secret") !== secret) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { address?: string; amount?: string | number; memo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  let raw = String(body.address ?? "").trim();
  const memo = typeof body.memo === "string" ? body.memo.slice(0, 200) : "";

  if (raw && !HEX_ADDRESS.test(raw)) {
    const contact = resolveContact(raw);
    if (contact) raw = contact.address;
  }

  const address = normalizeAddress(raw);
  if (!address) {
    return NextResponse.json({ success: false, error: "Invalid recipient address" }, { status: 400 });
  }

  const amt = Number(body.amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    return NextResponse.json({ success: false, error: "Amount must be a positive number" }, { status: 400 });
  }
  if (amt > MAX_AMOUNT) {
    return NextResponse.json({ success: false, error: `Amount exceeds the limit of ${MAX_AMOUNT} USDC` }, { status: 400 });
  }
  const amount = amt.toFixed(6).replace(/\.?0+$/, "");

  try {
    const result = await kit.send({
      from: { adapter, chain: Blockchain.Arc_Testnet },
      to: address,
      amount,
      token: "USDC",
    });

    // === DEBUG: dump the raw SDK result to a file so we can see its exact shape.
    // Open  data/last-send-result.json  and share it. Remove this block once stable.
    const dump = safeStringify(result);
    try {
      await fs.writeFile(
        path.join(process.cwd(), "data", "last-send-result.json"),
        dump,
        "utf8"
      );
    } catch {}
    console.log("[/api/send] kit.send result =", dump);
    // === end DEBUG

    const hash = extractHash(result);

    await addTransaction({
      hash,
      address,
      amount,
      memo,
      timestamp: new Date().toISOString(),
      status: "Pending",
    });

    let status: "Pending" | "Success" | "Failed" = "Pending";
    if (hash) {
      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: hash as `0x${string}`,
          timeout: 20_000,
        });
        status = receipt.status === "success" ? "Success" : "Failed";
        await updateStatus(hash, status);
      } catch (e) {
        console.warn("[/api/send] receipt wait failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      hash,
      status,
      address,
      amount,
      recipient: contactName(address),
    });
  } catch (error) {
    console.error("[/api/send] error:", error);
    return NextResponse.json({ success: false, error: "Transaction failed. Please try again." }, { status: 500 });
  }
}