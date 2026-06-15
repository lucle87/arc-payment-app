import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import Providers from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

const SITE = "https://arc-payment-app-git-main-tranboo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "ARC Payment App",
  description:
    "AI-powered USDC payments on Arc testnet. Log in with email, get a wallet, and pay by typing.",
  openGraph: {
    title: "ARC Payment App",
    description: "AI-powered USDC payments on Arc testnet.",
    type: "website",
    url: SITE,
  },
  twitter: {
    card: "summary_large_image",
    title: "ARC Payment App",
    description: "AI-powered USDC payments on Arc testnet.",
    creator: "@ace9vn",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="text-white">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
