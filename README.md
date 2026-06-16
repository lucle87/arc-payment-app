# ⚡ ARC Payment App

> A stablecoin wallet that feels like a normal app. Log in with email, get a wallet, and send or split USDC and EURC by simply typing. Built on [Arc](https://www.arc.io/), Circle's stablecoin-native L1.

**Live demo:** https://boarcpay.vercel.app · **Network:** Arc Testnet · **Built by:** [@ace9vn](https://x.com/ace9vn)

---

## What it is

ARC Payment App removes the usual friction of crypto payments. There is no seed phrase and no browser extension: you sign in with an email, a wallet is created for you, and you pay by describing the payment in plain English. Transactions settle in under a second on Arc, and gas is paid in USDC, so a stablecoin payment finally feels like using a normal app.
<img width="1225" height="840" alt="image" src="https://github.com/user-attachments/assets/cf776707-cb8f-46d0-b3ba-cc5c2d49e7ed" />


## Features

- **Email login, self-custodial wallet.** Powered by Privy embedded wallets. The user owns the keys and can export them anytime. No seed phrase, no MetaMask.
- **AI agent payments.** Describe a batch in one sentence (for example, "Split 30 USDC between Alice and Bob" or "Pay everyone 1 EURC"). The agent plans the payments, you review, and it sends them one by one with live progress.
- **Plain-English single sends.** "Send 0.1 USDC to Alice for pizza" is parsed, confirmed, and sent.
- **Multi-currency: USDC and EURC.** Pick the currency on the Send screen, see both balances, and the AI detects "EURC" in your sentence automatically.
- **Payment request links and QR.** Generate a shareable link or QR that pre-fills a payment to you, in either currency.
- **Contacts.** Add, edit, and delete recipients, each with an on-chain jazzicon avatar.
- **Private per-wallet history.** Each user only sees their own transactions, with memo, CSV export, search, and a volume chart.
- **Arc speed and fees, surfaced in the UI.** Every send shows "Confirmed in 0.Xs" and the USDC network fee.

## Why Arc

This app is built to showcase what Arc does that general-purpose chains do not:

- **USDC as native gas.** Predictable, dollar-denominated fees, with no volatile gas token to manage.
- **Sub-second deterministic finality.** Payments confirm almost instantly.
- **Agentic economy.** The AI agent turns one sentence into multiple settled payments, matching Arc's focus on autonomous, programmable value movement.
- **Multi-currency stablecoins.** Native USDC and EURC support, a foundation for FX and cross-border use cases.

### Network details (Arc Testnet)

| | |
|---|---|
| Chain ID | `5042002` |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` (6 decimals) |
| EURC (ERC-20) | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` (6 decimals) |
| Gas token | USDC (native) |
| Explorer | https://testnet.arcscan.app |
| Faucet | https://faucet.circle.com |

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page (story and features) |
| `/wallet` | Balances (USDC and EURC), payments, contacts, volume |
| `/send` | Manual send with currency selector, plus AI single send |
| `/receive` | Address, QR, and payment request links |
| `/agent` | AI agent for batch and split payments |
| `/explorer` | Your private transaction history, chart, search, CSV |
| `/contacts` | Saved recipients |
<img width="1062" height="850" alt="image" src="https://github.com/user-attachments/assets/aa2026fc-8a42-4ee5-9efe-90e47360cd1d" />

## Tech stack

- **Next.js (App Router)** with **TypeScript** and **Tailwind CSS v4**
- **Privy** for email login and embedded (self-custodial) wallets
- **viem** for signing, transfers, and on-chain reads
- **Upstash Redis** for persistent, per-wallet transaction history (serverless friendly)
- **OpenAI** for natural-language payment parsing (with a regex fallback)
- **sonner** (toasts), **react-jazzicon** (avatars), **qrcode.react** (QR), **recharts** (charts)

## Architecture (brief)

Signing happens entirely client-side using the user's Privy embedded wallet over viem. After a transfer confirms on-chain, the app persists the record (sender, recipient, token, memo) to Redis, scoped per wallet, so history survives serverless restarts and stays private to each user. Contact name to address resolution is done on the client, since contacts live in the browser's local storage.

## Getting started

```bash
# 1. Clone
git clone https://github.com/lucle87/arc-payment-app
cd arc-payment-app

# 2. Install (peer deps from the ox/viem range need the legacy flag)
npm install --legacy-peer-deps

# 3. Add environment variables (see below) to .env.local

# 4. Run
npm run dev   # http://localhost:3000
```

Get test USDC and EURC for your wallet from the [Circle faucet](https://faucet.circle.com) (select **Arc Testnet**).

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_PRIVY_APP_ID` | yes | Email login and embedded wallets |
| `UPSTASH_REDIS_REST_URL` | yes | Transaction history store |
| `UPSTASH_REDIS_REST_TOKEN` | yes | Transaction history store |
| `OPENAI_API_KEY` | optional | Smarter NL parsing (falls back to regex if absent) |

`.env.local` is gitignored. Never commit it.

## Deploy

Deploys cleanly to **Vercel**. Add the same environment variables in **Project, Settings, Environment Variables**, then redeploy. The transaction store uses **Upstash Redis** (free tier, no card required) so history persists on serverless.

## Roadmap

- USDC and EURC FX via Circle StableFX
- Cross-chain USDC via Circle CCTP
- Gasless and session-key payments (zero-tap)
- Server-synced contacts across devices

## Disclaimer

This is a demo on **Arc Testnet** using test tokens only. It is not affiliated with or endorsed by Circle. Not financial advice.

---

Built on [Arc](https://www.arc.io/) 🟠 · Follow [@ace9vn](https://x.com/ace9vn)
