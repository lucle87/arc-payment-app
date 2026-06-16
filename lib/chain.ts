import {
  createPublicClient,
  http,
  erc20Abi,
  formatUnits,
  type Address,
} from "viem";
import { arcTestnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

// --- Tokens on Arc testnet (both 6 decimals) ---
export const ARC_USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as Address;
export const USDC_DECIMALS = 6;

export const ARC_EURC_ADDRESS = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" as Address;
export const EURC_DECIMALS = 6;

export type TokenSymbol = "USDC" | "EURC";

export const TOKENS: Record<TokenSymbol, { symbol: TokenSymbol; address: Address; decimals: number }> = {
  USDC: { symbol: "USDC", address: ARC_USDC_ADDRESS, decimals: USDC_DECIMALS },
  EURC: { symbol: "EURC", address: ARC_EURC_ADDRESS, decimals: EURC_DECIMALS },
};

export function isToken(value: unknown): value is TokenSymbol {
  return value === "USDC" || value === "EURC";
}

/** Read an ERC-20 balance, formatted as a decimal string. */
export async function getTokenBalance(address: Address, token: TokenSymbol): Promise<string> {
  const t = TOKENS[token];
  const bal = (await publicClient.readContract({
    address: t.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  })) as bigint;
  return formatUnits(bal, t.decimals);
}

export async function getUsdcBalance(address: Address): Promise<string> {
  return getTokenBalance(address, "USDC");
}

export async function getEurcBalance(address: Address): Promise<string> {
  return getTokenBalance(address, "EURC");
}

/** Guess the intended token from free text (defaults to USDC). */
export function detectToken(text: string): TokenSymbol {
  return /eurc|euro|€/i.test(text) ? "EURC" : "USDC";
}

export function explorerTxUrl(hash: string): string {
  return `https://testnet.arcscan.app/tx/${hash}`;
}
