# ARC Payment App — Upgrade to a "real" testnet payment app

This bundle turns the demo into a working USDC payment app on **Arc testnet**:
real on-chain balance, real sends with validation, persisted history with memos,
real AI parsing (OpenAI) with a safe fallback, the previously-missing `/send`
page, a working chart, and proper transaction/explorer links.

## How to apply

Copy these files into your repo, **keeping the same paths** (overwrite when asked).
Then:

```bash
npm install
cp .env.example .env.local   # then fill in the values (keep your existing keys)
npm run dev
```

No new dependencies are required — everything uses packages already in your
`package.json` (`viem`, `openai`, `recharts`, `@circle-fin/*`).

## Environment variables (`.env.local`)

| Var | Required | Purpose |
|-----|----------|---------|
| `PRIVATE_KEY` | yes | Wallet that sends USDC (server-only). |
| `KIT_KEY` | yes | Circle App Kit API key. |
| `OPENAI_API_KEY` | no | Enables real AI parsing in `/api/ai-send`. Without it, a regex fallback is used. |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini`. |
| `SEND_SECRET` | no | If set, `/api/send` requires header `x-send-secret`. **Recommended.** |
| `MAX_SEND_AMOUNT` | no | Per-transfer cap in USDC. Defaults to `100`. |
| `ARC_TESTNET_RPC_URL` | no | Custom RPC; defaults to viem's public Arc RPC. |

Fund the wallet at https://faucet.circle.com (select Arc Testnet).

## What changed (and why)

**Security**
- `/api/send` now: optional auth (`SEND_SECRET`), validates the recipient with
  `viem.isAddress`, rejects non-positive amounts, enforces `MAX_SEND_AMOUNT`,
  caps memo length, returns proper HTTP status codes, and no longer leaks raw
  error strings to the client.

**Real data**
- `lib/chain.ts` reads the **live USDC balance** from the Arc USDC system
  contract (`0x3600…0000`, 6 decimals) via viem. Exposed at `/api/balance`.
- `lib/store.ts` **persists every send** (incl. memo, which is *not* on-chain)
  and the send route waits for the on-chain receipt to mark Success/Failed.
  History (`/api/transactions`, `/explorer`, `/address/...`) now reflects real
  sends instead of static seed data.

**Bug fixes**
- Send forms read the tx hash correctly (was reading `data.hash` while the API
  returned `data.result` → success/hash never showed).
- Added the missing **`/send`** page (Navbar linked to a 404). Both `SendForm`
  and `AISendForm` are mounted there.
- AI/contact matching is **case-insensitive** ("alice" now resolves to Alice).
- Contacts are defined **once** in `lib/contacts.ts` (was duplicated 4×).
  "Send Money" on the Contacts page now deep-links to `/send?to=…`.
- `TransactionChart` renders a real recharts bar chart (daily volume).
- CSV export is properly escaped + guarded against formula injection.
- Status badges now color by actual status (Success/Pending/Failed).

## Known limitations / next steps

- **Persistence on Vercel:** the file-based store in `lib/store.ts` works locally
  but Vercel's serverless filesystem is read-only. For production, swap the two
  helpers in that file for Vercel KV / Upstash / Postgres (the interface is tiny
  on purpose). Sends still succeed without it — only history won't persist.
- **App Kit return shape:** the send route reads `result.transactionHash ?? result.hash`.
  If your App Kit version returns the hash under a different field, adjust that one line.
- **Placeholder contacts:** Bob and Charlie use placeholder addresses. Replace
  them with real Arc addresses before sending to them.
- **Auth:** `SEND_SECRET` is a shared-secret guard. For a real multi-user app,
  replace it with proper per-user auth/sessions.
