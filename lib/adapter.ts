/// <reference types="node" />

import { createViemAdapterFromPrivateKey }
from "@circle-fin/adapter-viem-v2";

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  throw new Error("PRIVATE_KEY is missing in .env.local");
}

const adapter = createViemAdapterFromPrivateKey({
  privateKey,
});

export default adapter;