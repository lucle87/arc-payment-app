import { createAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

export const adapter = createAdapterFromPrivateKey({
  privateKey,
});