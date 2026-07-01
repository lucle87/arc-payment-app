"use client";

import { useMemo, useState } from "react";
import { useWallets } from "@privy-io/react-auth";

type StepInfo = { name: string; state: string; explorerUrl?: string; txHash?: string };

const CHAINS: { id: string; label: string }[] = [
  { id: "Arc_Testnet", label: "Arc Testnet" },
  { id: "Ethereum_Sepolia", label: "Ethereum Sepolia" },
  { id: "Base_Sepolia", label: "Base Sepolia" },
  { id: "Avalanche_Fuji", label: "Avalanche Fuji" },
];

const STEP_LABEL: Record<string, string> = {
  approve: "Approve",
  burn: "Burn on source",
  fetchAttestation: "Fetch attestation",
  mint: "Mint on destination",
};

function labelOf(id: string) {
  return CHAINS.find((c) => c.id === id)?.label ?? id;
}

// Privy forwards unknown wallet RPC methods to the node, and Arc's RPC returns
// 400 for the EIP-5792 methods. We make those methods report "unsupported" (like a
// wallet without 5792 support) so App Kit cleanly falls back to legacy sequential
// approve/burn instead of hanging on atomic-batch detection.
const UNSUPPORTED_METHODS = new Set([
  "wallet_getCapabilities",
  "wallet_sendCalls",
  "wallet_getCallsStatus",
  "wallet_showCallsStatus",
]);

function patchProvider(provider: any): any {
  return new Proxy(provider, {
    get(target, prop: string) {
      if (prop === "request") {
        return async (args: any) => {
          if (UNSUPPORTED_METHODS.has(args?.method)) {
            const err: any = new Error("Method not supported");
            err.code = 4200;
            throw err;
          }
          return target.request(args);
        };
      }
      const v = target[prop];
      return typeof v === "function" ? v.bind(target) : v;
    },
  });
}

export default function BridgeForm() {
  const { wallets } = useWallets();
  const [from, setFrom] = useState("Ethereum_Sepolia");
  const [to, setTo] = useState("Arc_Testnet");
  const [amount, setAmount] = useState("1");
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const address = useMemo(
    () => wallets.find((w) => w.walletClientType === "privy")?.address,
    [wallets]
  );

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function upsertStep(s: StepInfo) {
    setSteps((prev) => {
      const i = prev.findIndex((p) => p.name === s.name);
      if (i >= 0) {
        const c = [...prev];
        c[i] = { ...c[i], ...s };
        return c;
      }
      return [...prev, s];
    });
  }

  async function handleBridge() {
    setError(null);
    setDone(false);
    setSteps([]);
    setNote(null);

    if (from === to) {
      setError("Source and destination must be different chains.");
      return;
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    if (!embedded) {
      setError("Please log in first.");
      return;
    }

    setBusy(true);
    try {
      const rawProvider = await embedded.getEthereumProvider();
      const provider = patchProvider(rawProvider);

      // Loaded lazily so the SDK only runs in the browser.
      const appkitMod: any = await import("@circle-fin/app-kit");
      const adapterMod: any = await import("@circle-fin/adapter-viem-v2");

      const adapter = await adapterMod.createViemAdapterFromProvider({ provider });
      const kit = new appkitMod.AppKit();

      kit.on("*", (payload: any) => {
        console.log("[bridge] event:", payload);
        const v = payload?.values;
        if (v?.name) {
          upsertStep({
            name: v.name,
            state: v.state ?? "pending",
            explorerUrl: v.explorerUrl,
            txHash: v.txHash,
          });
        }
      });

      console.log("[bridge] calling kit.bridge", { from, to, amount });
      const slowTimer = setTimeout(() => {
        setNote("Still working. If a burn already happened, it may be waiting for Circle attestation, which can take a few minutes on testnet.");
      }, 60_000);

      let result: any;
      try {
        result = await kit.bridge({
          from: { adapter, chain: from },
          to: { adapter, chain: to },
          amount: String(amount),
        });
      } finally {
        clearTimeout(slowTimer);
      }
      console.log("[bridge] kit.bridge result", result);

      if (result?.state === "error" && typeof kit.retryBridge === "function") {
        result = await kit.retryBridge(result, { from: adapter, to: adapter });
      }

      if (Array.isArray(result?.steps)) {
        for (const st of result.steps) {
          upsertStep({
            name: st.name,
            state: st.state,
            explorerUrl: st?.data?.explorerUrl ?? st?.explorerUrl,
            txHash: st.txHash,
          });
        }
      }

      if (result?.state === "error") {
        setError("Bridge failed. Check that the wallet has USDC on the source chain and native gas on both chains, then retry.");
      } else {
        setDone(true);
      }
    } catch (e: any) {
      setError(e?.message ?? "Bridge failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8 space-y-5">
        {/* From / To */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">From</span>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
            >
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={swap}
            title="Swap direction"
            className="mb-1 rounded-xl border border-zinc-700 px-3 py-3 text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition"
          >
            ⇄
          </button>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">To</span>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
            >
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Amount */}
        <label className="block">
          <span className="mb-2 block text-sm text-zinc-400">Amount (USDC)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="1.00"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
          />
        </label>

        <button
          onClick={handleBridge}
          disabled={busy}
          className="w-full rounded-xl bg-orange-500 px-6 py-3.5 font-semibold hover:bg-orange-400 disabled:opacity-50"
        >
          {busy ? "Bridging…" : `Bridge ${amount || ""} USDC`}
        </button>

        <p className="text-xs text-zinc-500">
          Bridging {labelOf(from)} → {labelOf(to)} via Circle CCTP. The wallet needs USDC on the
          source chain and a little native gas on both chains. When bridging from Arc, the amount
          must exceed the CCTP max fee.
        </p>
      </div>

      {/* Progress */}
      {steps.length > 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
          <h3 className="font-semibold">Progress</h3>
          {steps.map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-zinc-300">{STEP_LABEL[s.name] ?? s.name}</span>
              <span className="flex items-center gap-3">
                <span
                  className={
                    s.state === "success"
                      ? "text-green-400"
                      : s.state === "error"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }
                >
                  {s.state}
                </span>
                {s.explorerUrl && (
                  <a href={s.explorerUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">
                    view
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {note && !error && (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
          {note}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}
      {done && !error && (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
          Bridge submitted. Use the explorer links above to confirm each step.
        </div>
      )}

      {!address && (
        <p className="text-center text-sm text-zinc-500">Log in to bridge.</p>
      )}
    </div>
  );
}
