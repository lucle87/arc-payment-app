import { createAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;

if (!privateKey) {
  // Don't throw at import time (it would break `next build`); warn instead.
  console.warn(
    "[adapter] PRIVATE_KEY is not set — /api/send and /api/balance will fail until it is configured."
  );
}

export const adapter = createAdapterFromPrivateKey({
  privateKey: privateKey as `0x${string}`,
});

/** The public address that owns the wallet, derived from the private key. */
export const senderAddress: `0x${string}` | undefined = privateKey
  ? privateKeyToAccount(privateKey).address
  : undefined;
