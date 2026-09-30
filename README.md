# Verify Route

**Know. Verify. Route.** Inference routing with verified transparency, on Robinhood Chain.

Website: https://verifyroute.tech · X: [@verifroute](https://x.com/verifroute) · Token: **$Verify**

---

## The problem

Calling an AI model today means trusting a black box twice over.

- **You cannot see who answered.** A gateway says it sent your prompt to a given model. Whether the host really ran those weights, at the precision it advertised, is something you take on faith.
- **You cannot prove what it cost.** Usage and billing live in a dashboard you do not control. There is nothing portable to show an auditor, a client or your own finance team.
- **Privacy is a checkbox.** "We do not train on your data" is a sentence in a policy, not something you can verify at request time.
- **Every provider means another key and another balance.** Hundreds of models, dozens of accounts, no shared accounting.

## The solution

Verify Route is an inference router (an AI model gateway) that replaces blind trust with cryptographic proof:

1. **Know** — hundreds of AI models behind **one API key and one USDG balance**, through the chat-completions request shape your code already uses.
2. **Verify** — every call is backed by evidence:
   - **Provider bonds** — each provider locks **10,000 USDG** before serving traffic; proven failures can be slashed after a 72-hour dispute window.
   - **Quality canaries** — automated test prompts check that providers serve the weights and quality they declare.
   - **Signed receipts** — an Ed25519 receipt per call covering model, provider, tokens, cost and hashes of the request and reply, with receipt roots anchored on Robinhood Chain.
3. **TEE attestation** — private lanes only reach hosts whose hardware enclave quote was verified minutes ago; the quote hash is written into the receipt, and the request fails closed otherwise.

## What you can try

Live today in this codebase:

| Feature | Where | Notes |
| --- | --- | --- |
| Live model catalog | `/models`, home page marquee | Read from the public OpenRouter models endpoint, cached for an hour |
| Wallet sign-in | every "Connect wallet" button | EIP-6963 wallets, WalletConnect (optional), adds Robinhood Chain on connect |
| ETH + USDG balances | account menu, `/dashboard` | Read from Robinhood Chain through a read-only relay |
| Chain status | `/status`, home strip | Latest block, block time, gas price, USDG supply |
| Receipt checker | `/verify` | Verifies an Ed25519 receipt in your browser with WebCrypto |
| Chat, arena, ask-your-files | `/console`, `/arena`, `/ask` | Live when the operator sets `OPENROUTER_API_KEY`; otherwise a calm "not configured" state |

Coming next (shown on the site as design previews, never as live data): router-issued receipts and anchors, provider bonds and disputes, canary suites, the attested registry, blind credits and the VEIL privacy protocol. The `$Verify` contract address is published at launch.

## Run it locally

Requirements: Node.js 20 or newer and npm.

1. Download the ZIP of this repository or fork it, then open the folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start it:
   ```bash
   npm run dev              # development, http://localhost:4740
   # or
   npm run build && npm start   # production build on port 4740
   ```

Optional environment variables (create `.env.local` yourself; the app runs without any of them):

| Variable | Purpose | Format |
| --- | --- | --- |
| `ROBINHOOD_RPC_URL` | Your own Robinhood Chain RPC for server-side reads | full https URL from your RPC provider |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Enables the WalletConnect option | project id from cloud.reown.com |
| `OPENROUTER_API_KEY` | Enables live chat in `/console`, `/arena` and `/ask` | starts with `sk-or-v1-`, from openrouter.ai/settings/keys |

On Vercel, add the same names under Project → Settings → Environment Variables and redeploy.

## Robinhood Chain in your wallet

Connecting adds the network automatically. To add it by hand:

| Field | Value |
| --- | --- |
| Network name | Robinhood Chain |
| Chain ID | 4663 (0x1237) |
| Currency | ETH |
| RPC URL | https://rpc.mainnet.chain.robinhood.com |
| Explorer | https://robinhoodchain.blockscout.com |

USDG on Robinhood Chain: `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` (6 decimals). Phantom cannot add custom EVM networks; use MetaMask, Rabby, OKX, Coinbase Wallet or another wallet that can.

## Project layout

```
src/
  app/                 routes (App Router): home, models, console, arena, ask, docs,
                       veil, spec, dashboard, verify, status, registry, providers, legal …
  app/api/             rpc relay, model catalog, chat proxy
  components/          site shell, home sections, wallet, docs, playground, trust pages
  config/brand.ts      name, ticker, links, chain and the token contract address
  config/wallets.ts    wallet catalog for the connect dialog
  lib/                 chain reads, model catalog, browser RPC helpers
public/wallets/        wallet logos (.webp)
```

## Token contract

`$Verify` on Robinhood Chain: **published at launch**. The address lives in one place, `src/config/brand.ts`; every copy button on the site reads it from there.
