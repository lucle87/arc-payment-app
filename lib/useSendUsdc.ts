"use client";

import { useWallets } from "@privy-io/react-auth";
import { toast } from "sonner";
import {
  createWalletClient,
  custom,
  parseUnits,
  getAddress,
  erc20Abi,
  type Address,
} from "viem";
import { arcTestnet } from "viem/chains";
import { ARC_USDC_ADDRESS, USDC_DECIMALS, publicClient } from "@/lib/chain";

export type SendResult = { hash: string; status: "Success" | "Failed" | "Pending" };

function normalize(value: string): Address {
  return getAddress(value.toLowerCase());
}

export function useSendUsdc() {
  const { wallets } = useWallets();

  async function send({
    to,
    amount,
    memo,
  }: {
    to: string;
    amount: string;
    memo?: string;
  }): Promise<SendResult> {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    if (!embedded) throw new Error("No wallet found. Please log in first.");

    const toastId = toast.loading(`Sending ${amount} USDC…`);
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
      const value = parseUnits(amount, USDC_DECIMALS);

      const hash = await walletClient.writeContract({
        address: ARC_USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "transfer",
        args: [toAddr, value],
        account,
        chain: arcTestnet,
      });

      let status: SendResult["status"] = "Pending";
      try {
        const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 30_000 });
        status = receipt.status === "success" ? "Success" : "Failed";
      } catch {
        // leave Pending
      }

      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hash, address: toAddr, amount, memo: memo ?? "", status }),
        });
      } catch {
        // non-fatal
      }

      if (status === "Success") toast.success("Payment confirmed ✅", { id: toastId });
      else if (status === "Failed") toast.error("Transaction failed", { id: toastId });
      else toast.message("Payment submitted ⏳", { id: toastId });

      return { hash, status };
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed", { id: toastId });
      throw e;
    }
  }

  return { send };
}
