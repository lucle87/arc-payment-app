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
  type Address,
} from "viem";
import { arcTestnet } from "viem/chains";
import { ARC_USDC_ADDRESS, USDC_DECIMALS, publicClient } from "@/lib/chain";

export type SendResult = {
  hash: string;
  status: "Success" | "Failed" | "Pending";
  seconds: number;
  fee: string | null;
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
    silent,
  }: {
    to: string;
    amount: string;
    memo?: string;
    silent?: boolean;
  }): Promise<SendResult> {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    if (!embedded) throw new Error("No wallet found. Please log in first.");

    const toastId = silent ? undefined : toast.loading(`Sending ${amount} USDC…`);
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
          body: JSON.stringify({ hash, owner: account, address: toAddr, amount, memo: memo ?? "", status }),
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

      return { hash, status, seconds, fee };
    } catch (e) {
      if (!silent && toastId !== undefined) {
        toast.error(e instanceof Error ? e.message : "Payment failed", { id: toastId });
      }
      throw e;
    }
  }

  return { send };
}
