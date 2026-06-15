"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useContacts } from "@/lib/useContacts";
import { useSendUsdc } from "@/lib/useSendUsdc";

type Row = {
  recipient: string;
  address: string;
  amount: string;
  memo: string;
  state: "idle" | "sending" | "done" | "failed";
  hash?: string;
  seconds?: number;
  fee?: string | null;
};

type Phase =
  | { status: "idle" }
  | { status: "planning" }
  | { status: "review" }
  | { status: "running" }
  | { status: "error"; message: string };

export default function AgentPayment({ onSent }: { onSent?: () => void }) {
  const { authenticated, login } = usePrivy();
  const { contacts, resolveByName } = useContacts();
  const { send } = useSendUsdc();

  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  const [rows, setRows] = useState<Row[]>([]);

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);

  async function plan() {
    if (!text.trim()) return;
    if (!authenticated) return login();
    setPhase({ status: "planning" });
    setRows([]);
    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, contacts: contacts.map((c) => c.name) }),
      });
      const data = await res.json();
      if (!data.success) {
        setPhase({ status: "error", message: data.error });
        return;
      }

      const missing: string[] = [];
      const built: Row[] = [];
      for (const p of data.payments as { recipient: string; amount: string; memo?: string }[]) {
        const contact = resolveByName(p.recipient);
        if (!contact) {
          missing.push(p.recipient);
          continue;
        }
        built.push({
          recipient: contact.name,
          address: contact.address,
          amount: String(p.amount),
          memo: p.memo ?? "",
          state: "idle",
        });
      }

      if (missing.length) {
        setPhase({
          status: "error",
          message: `Not in contacts: ${missing.join(", ")}. Add them first.`,
        });
        return;
      }
      setRows(built);
      setPhase({ status: "review" });
    } catch {
      setPhase({ status: "error", message: "Network error" });
    }
  }

  async function run() {
    setPhase({ status: "running" });
    for (let i = 0; i < rows.length; i++) {
      setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, state: "sending" } : r)));
      try {
        const { hash, seconds, fee } = await send({
          to: rows[i].address,
          amount: rows[i].amount,
          memo: rows[i].memo,
          silent: true,
        });
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, state: "done", hash, seconds, fee } : r)));
      } catch {
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, state: "failed" } : r)));
      }
    }
    onSent?.();
  }

  const sentCount = rows.filter((r) => r.state === "done").length;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <h2 className="text-3xl font-bold mb-2">AI Agent 🤖</h2>
      <p className="text-zinc-500 mb-6 text-sm">
        Pay many people at once. Try: &quot;Split 30 USDC between Alice and Bob for dinner&quot; or
        &quot;Pay everyone 1 USDC&quot;.
      </p>

      {!authenticated ? (
        <button onClick={login} className="w-full rounded-xl bg-orange-500 py-3 font-semibold">
          Login to use the agent
        </button>
      ) : (
        <>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Split 30 USDC between Alice and Bob 🍕"
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
            disabled={phase.status === "running"}
          />
          <button
            onClick={plan}
            disabled={phase.status === "planning" || phase.status === "running" || !text.trim()}
            className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-semibold disabled:opacity-40"
          >
            {phase.status === "planning" ? "Planning…" : "Plan with AI"}
          </button>

          {(phase.status === "review" || phase.status === "running") && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-3 flex justify-between text-sm text-zinc-400">
                <span>{rows.length} payment(s) · total {total.toFixed(2)} USDC</span>
                {phase.status === "running" && (
                  <span className="text-orange-400">{sentCount}/{rows.length} sent</span>
                )}
              </div>

              <div className="space-y-2">
                {rows.map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-zinc-950 px-4 py-3">
                    <div>
                      <div className="font-semibold">{r.recipient}</div>
                      {r.memo && <div className="text-xs text-zinc-500">{r.memo}</div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-orange-400 font-semibold">{r.amount} USDC</span>
                      <span className="text-sm w-20 text-right">
                        {r.state === "idle" && <span className="text-zinc-600">—</span>}
                        {r.state === "sending" && <span className="text-zinc-400">…</span>}
                        {r.state === "done" &&
                          (r.hash ? (
                            <a href={`/explorer/${r.hash}`} className="text-green-400 underline">
                              {r.seconds != null ? `✅ ${r.seconds.toFixed(1)}s` : "✅"}
                            </a>
                          ) : (
                            <span className="text-green-400">✅</span>
                          ))}
                        {r.state === "failed" && <span className="text-red-400">❌</span>}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {phase.status === "review" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setPhase({ status: "idle" })}
                    className="flex-1 rounded-xl border border-zinc-700 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={run}
                    className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold"
                  >
                    Send all ({rows.length})
                  </button>
                </div>
              )}

              {phase.status === "running" && sentCount + rows.filter((r) => r.state === "failed").length === rows.length && (
                <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-center">
                  <p className="text-green-400 font-bold">⚡ Sent {sentCount}/{rows.length} on Arc</p>
                  {(() => {
                    const done = rows.filter((r) => r.state === "done" && r.seconds != null);
                    const avg = done.length ? done.reduce((s, r) => s + (r.seconds || 0), 0) / done.length : 0;
                    const feeSum = rows.reduce((s, r) => s + Number(r.fee || 0), 0);
                    return (
                      <p className="text-xs text-zinc-400 mt-1">
                        avg {avg.toFixed(1)}s each{feeSum > 0 ? ` · total fee ≈ ${feeSum.toFixed(4)} USDC` : ""}
                      </p>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {phase.status === "error" && (
            <p className="mt-6 rounded-2xl bg-red-500/10 p-4 text-red-400">{phase.message}</p>
          )}
        </>
      )}
    </div>
  );
}
