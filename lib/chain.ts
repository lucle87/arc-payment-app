import { createPublicClient, http, erc20Abi, formatUnits } from "viem";
import { arcTestnet } from "viem/chains";

/**
 * Arc testnet config (single source of truth).
 * - Chain id: 5042002 (arcTestnet is built into viem, no custom chain needed)
 * - USDC is the NATIVE gas token on Arc, exposed as an ERC-20 at this system address.
 * - The ERC-20 interface uses 6 decimals (the native gas interface uses 18).
 *   For reading balances and sending transfers we ALWAYS use the 6-decimal ERC-20 view.
 */
export const ARC_USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as const;
export const USDC_DECIMALS = 6;

export const publicClient = createPublicClient({
  chain: arcTestnet,
  // If ARC_TESTNET_RPC_URL is unset, viem uses Arc's default public RPC.
  transport: http(process.env.ARC_TESTNET_RPC_URL),
});

/** Block-explorer URL for a tx hash (falls back to viem's chain definition). */
export function explorerTxUrl(hash: string): string {
  const base = arcTestnet.blockExplorers?.default?.url;
  return base ? `${base}/tx/${hash}` : "";
}

/** Read the USDC balance of an address as a human string, e.g. "12.5". */
export async function getUsdcBalance(
  address: `0x${string}`
): Promise<string> {
  const raw = (await publicClient.readContract({
    address: ARC_USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  })) as bigint;

  return formatUnits(raw, USDC_DECIMALS);
}
