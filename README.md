# ⚡ ARC Payment App

> A stablecoin wallet that feels like a normal app — log in with email, get a wallet, and send or split USDC by simply typing. Built on [Arc](https://www.arc.io/), Circle's stablecoin-native L1.

**Live demo:** https://boarcpay.vercel.app · **Network:** Arc Testnet · **Built by:** [@ace9vn](https://x.com/ace9vn)

---

## What it is

ARC Payment App removes the usual friction of crypto payments. There's no seed phrase and no browser extension: you sign in with an email, a wallet is created for you, and you pay by describing the payment in plain English. Transactions settle in under a second on Arc, and gas is paid in USDC — so a stablecoin payment finally feels like using a normal app.

## Features

- **Email login, self-custodial wallet** — powered by Privy embedded wallets. The user owns the keys and can export them anytime. No seed phrase, no MetaMask.
- **AI agent payments** — describe a batch in one sentence (e.g. *"Split 30 USDC between Alice and Bob"* or *"Pay everyone 1 USDC"*); the agent plans the payments, you review, and it sends them.
- **Plain-English single sends** — *"Send 0.1 USDC to Alice for pizza"* is parsed, confirmed, and sent.
- **Payment request links + QR** — generate a shareable link/QR that pre-fills a payment to you.
- **Contacts** — add/edit/delete recipients with on-chain jazzicon avatars.
- **Per-wallet history** — each user only sees their own transactions, with memo, CSV export, search, and a volume chart.
- **Arc USP, surfaced in the UI** — every send shows *"Confirmed in 0.Xs ⚡"* and the USDC network fee.

## Why Arc

This app is built to showcase what Arc does that general-purpose chains don't:

- **USDC as native gas** — predictable, dollar-denominated fees; no volatile gas token to manage.
- **Sub-second deterministic finality** — payments confirm almost instantly.
- **Agentic economy** — the AI agent turns one sentence into multiple settled payments, matching Arc's focus on autonomous, programmable value movement.

### Network details (Arc Testnet)

| | |
|---|---|
| Chain ID | `5042002` |
| RPC | `https://rpc.testnet.arc.network` |
| USDC (ERC-20) | `0x3600000000000000000000000000000000000000` (6 decimals) |
| EURC (ERC-20) | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` (6 decimals) |
| Gas token | USDC (native) |
| Explorer | https://testnet.arcscan.app |
| Faucet | https://faucet.circle.com |

## Tech stack

- **Next.js (App Router)** + **TypeScript** + **Tailwind CSS v4**
- **Privy** — email login + embedded (self-custodial) wallets
- **viem** — signing, transfers, on-chain reads
- **Upstash Redis** — persistent, per-wallet transaction history (serverless-friendly)
- **OpenAI** — natural-language payment parsing (with a regex fallback)
- **sonner** (toasts), **react-jazzicon** (avatars), **qrcode.react** (QR), **recharts** (charts)

## Architecture (brief)

Signing happens entirely client-side using the user's Privy embedded wallet over viem. After a transfer confirms on-chain, the app persists the record (with memo and sender address) to Redis so history survives serverless restarts and stays scoped per wallet. Name → address resolution for contacts is done on the client (contacts live in the browser's local storage).

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

Get test USDC for your wallet from the [Circle faucet](https://faucet.circle.com) (select **Arc Testnet**).

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_PRIVY_APP_ID` | yes | Email login + embedded wallets |
| `UPSTASH_REDIS_REST_URL` | yes | Transaction history store |
| `UPSTASH_REDIS_REST_TOKEN` | yes | Transaction history store |
| `OPENAI_API_KEY` | optional | Smarter NL parsing (falls back to regex if absent) |

`.env.local` is gitignored — never commit it.

## Deploy

Deploys cleanly to **Vercel**. Add the same environment variables in **Project → Settings → Environment Variables**, then redeploy. The transaction store uses **Upstash Redis** (free tier, no card required) so history persists on serverless.

## Roadmap

- EURC support for multi-currency stablecoin payments
- USDC ↔ EURC FX via Circle StableFX
- Cross-chain USDC via Circle CCTP
- Gasless / session-key payments (zero-tap)
- Server-synced contacts across devices

## Disclaimer

This is a demo on **Arc Testnet** using test tokens only. It is not affiliated with or endorsed by Circle. Not financial advice.

---

Built on [Arc](https://www.arc.io/) 🟠 · Follow [@ace9vn](https://x.com/ace9vn)
