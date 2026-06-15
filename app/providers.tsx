"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { arcTestnet } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: { theme: "dark", accentColor: "#f97316" },
        loginMethods: ["email"],
        defaultChain: arcTestnet,
        supportedChains: [arcTestnet],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          // false = no extra Privy popup; the app shows its own confirm step.
          showWalletUIs: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
