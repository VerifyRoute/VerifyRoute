// Data inventory: what this site keeps today, and what the router is designed
// to keep once it routes calls. The page and /retention/inventory.json both
// read this file, so they cannot drift apart.

export const INVENTORY = {
  format: "verifyroute.inventory/1",
  updated: "2026-09-30",
  summary: {
    statement: "No prompt or answer text is ever written to a database.",
    status: "The router is not live. The website section describes what this site does today; the router section is the design it is built to.",
  },
  site: [
    {
      where: "Wallet sign-in",
      read: "Your wallet address and the network your wallet is on, shared by your wallet when you connect.",
      kept: "Your address, wallet name and wallet id in this browser's localStorage, so you stay signed in. Disconnect removes it. Nothing is stored on a server.",
    },
    {
      where: "Chain reads (/api/rpc)",
      read: "Read-only JSON-RPC calls such as your ETH and USDG balance, relayed to Robinhood Chain because some networks block its public endpoint.",
      kept: "Not stored. The call is forwarded and the answer returned. Transactions never pass through the relay.",
    },
    {
      where: "Model catalog",
      read: "The public model list, fetched by this server without any key.",
      kept: "The list is held in server memory for up to an hour. It contains no user data.",
    },
    {
      where: "Console, arena and file questions",
      read: "Your prompt, and on the files page the text of the files you add, sent to the model provider through this server when the operator has configured a model key.",
      kept: "Not stored by this site. Held in memory for the length of the call. The model provider handles it under its own policy.",
    },
  ],
  categories: [
    { id: "calls", label: "Call records", summary: "One row per call: model, provider, lane, token counts, cost, timing and SHA-256 hashes of the request and the reply. Never the text." },
    { id: "billing", label: "Balances and ledger", summary: "USDG balances per wallet, an append-only ledger, spending holds and what each provider is owed." },
    { id: "receipts", label: "Receipts and proofs", summary: "Signing keys, the Merkle log of receipts, checkpoints and the hourly on-chain anchors that let anyone check a receipt without asking." },
    { id: "keys", label: "Keys and sessions", summary: "API keys stored only as hashes, their policies, agent sessions, and the issuer keys behind blind credits." },
    { id: "providers", label: "Providers and evidence", summary: "Provider bonds, canary results, attestation checks, measurements and dispute records." },
    { id: "chain", label: "Chain records", summary: "Deposits, withdrawals, bond events and anchors read from Robinhood Chain, which are public anyway." },
    { id: "operations", label: "Operations", summary: "Rate-limit counters that expire within an hour, health probes and error counts. No network addresses in any table or log line." },
  ],
} as const;
