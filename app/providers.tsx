"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { Toaster } from "sonner";
import { arcTestnet, sepolia, baseSepolia, avalancheFuji } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: { theme: "dark", accentColor: "#f97316" },
        loginMethods: ["email"],
        defaultChain: arcTestnet,
        supportedChains: [arcTestnet, sepolia, baseSepolia, avalancheFuji],
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
          showWalletUIs: false,
        },
      }}
    >
      {children}
      <Toaster richColors theme="dark" position="top-center" />
    </PrivyProvider>
  );
}
