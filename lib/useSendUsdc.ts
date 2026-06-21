"use client";

import { useWallets } from "@privy-io/react-auth";
import { toast } from "sonner";
import {
  createWalletClient,
  custom,
  parseUnits,
  formatUnits,
  getAddress,
  erc20Abi,
  encodeFunctionData,
  keccak256,
  stringToHex,
  type Address,
  type Hex,
} from "viem";
import { arcTestnet } from "viem/chains";
import {
  TOKENS,
  publicClient,
  ARC_MEMO_ADDRESS,
  MEMO_ABI,
  type TokenSymbol,
} from "@/lib/chain";

export type SendResult = {
  hash: string;
  status: "Success" | "Failed" | "Pending";
  seconds: number;
  fee: string | null;
  token: TokenSymbol;
  memoId: string | null;
  onchainMemo: boolean;
};

function normalize(value: string): Address {
  return getAddress(value.toLowerCase());
}

export function useSendUsdc() {
  const { wallets } = useWallets();

  async function send({
    to,
    amount,
    memo,
    token = "USDC",
    silent,
  }: {
    to: string;
    amount: string;
    memo?: string;
    token?: TokenSymbol;
    silent?: boolean;
  }): Promise<SendResult> {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    if (!embedded) throw new Error("No wallet found. Please log in first.");

    const t = TOKENS[token];
    const toastId = silent ? undefined : toast.loading(`Sending ${amount} ${token}…`);
    const start = Date.now();
    try {
      try {
        await embedded.switchChain(arcTestnet.id);
      } catch {
        // ignore
      }

      const provider = await embedded.getEthereumProvider();
      const account = normalize(embedded.address);
      const walletClient = createWalletClient({
        account,
        chain: arcTestnet,
        transport: custom(provider),
      });

      const toAddr = normalize(to);
      const value = parseUnits(amount, t.decimals);
      const trimmedMemo = (memo ?? "").trim();

      let hash: Hex;
      let memoId: Hex | null = null;

      if (trimmedMemo) {
        // On-chain memo: forward the ERC-20 transfer through Arc's Memo contract.
        const transferData = encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [toAddr, value],
        });
        memoId = keccak256(stringToHex(`${account}-${Date.now()}-${Math.random()}`));
        const memoData = stringToHex(trimmedMemo);

        hash = await walletClient.writeContract({
          address: ARC_MEMO_ADDRESS,
          abi: MEMO_ABI,
          functionName: "memo",
          args: [t.address, transferData, memoId, memoData],
          account,
          chain: arcTestnet,
        });
      } else {
        // No memo: plain ERC-20 transfer (cheaper).
        hash = await walletClient.writeContract({
          address: t.address,
          abi: erc20Abi,
          functionName: "transfer",
          args: [toAddr, value],
          account,
          chain: arcTestnet,
        });
      }

      let status: SendResult["status"] = "Pending";
      let seconds = 0;
      let fee: string | null = null;

      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 30_000 });
        status = receipt.status === "success" ? "Success" : "Failed";
        seconds = (Date.now() - start) / 1000;
        try {
          if (receipt.gasUsed && receipt.effectiveGasPrice) {
            const feeUnits = receipt.gasUsed * receipt.effectiveGasPrice;
            const dec = arcTestnet.nativeCurrency?.decimals ?? 18;
            fee = formatUnits(feeUnits, dec);
          }
        } catch {
          // fee optional
        }
      } catch {
        seconds = (Date.now() - start) / 1000;
      }

      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hash,
            owner: account,
            address: toAddr,
            amount,
            memo: trimmedMemo,
            status,
            token,
            memoId: memoId ?? undefined,
            onchainMemo: !!memoId,
          }),
        });
      } catch {
        // non-fatal
      }

      if (!silent && toastId !== undefined) {
        if (status === "Success") {
          toast.success(`Confirmed in ${seconds.toFixed(1)}s ⚡`, { id: toastId });
        } else if (status === "Failed") {
          toast.error("Transaction failed", { id: toastId });
        } else {
          toast.message("Payment submitted ⏳", { id: toastId });
        }
      }

      return { hash, status, seconds, fee, token, memoId, onchainMemo: !!memoId };
    } catch (e) {
      if (!silent && toastId !== undefined) {
        toast.error(e instanceof Error ? e.message : "Payment failed", { id: toastId });
      }
      throw e;
    }
  }

  return { send };
}
