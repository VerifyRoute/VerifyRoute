"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND, CHAIN, USDG, explorerAddress, explorerToken, shortAddress } from "@/config/brand";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { ProofBars } from "@/components/site/ProofBars";

/* The workspace. Signing in is connecting a wallet. Wallet facts are read
   live from Robinhood Chain; everything that needs the router (keys,
   receipts, spend) shows an honest empty state until the router opens. */

const TABS = [
  ["overview", "Overview"],
  ["playground", "Playground"],
  ["saved-routes", "Saved routes"],
  ["eval-lab", "Eval lab"],
  ["batch-studio", "Batch studio"],
  ["models", "Models"],
  ["api-keys", "API keys"],
  ["agent-sessions", "Agent sessions"],
  ["receipts", "Receipts"],
  ["spend-watch", "Spend watch"],
  ["payments", "Payments"],
  ["holders", "Holders"],
  ["providers", "Providers"],
  ["settings", "Settings"],
] as const;

type Tab = (typeof TABS)[number][0];

const PREVIEW: Record<Exclude<Tab, "overview">, { title: string; body: string; cta?: [string, string] }> = {
  playground: { title: "The playground lives in the console", body: "Pick any model from the live catalog and talk to it on one page. Every reply will carry its cost and a signed receipt once the router is live.", cta: ["/console", "Open the console"] },
  "saved-routes": { title: "No saved routes yet", body: "A saved route pins a model, a provider filter and a verification policy under one name, so a whole team calls it the same way." },
  "eval-lab": { title: "Eval lab opens with the router", body: "Run the same prompt set against several models and providers, and compare answers, latency, cost and canary results side by side." },
  "batch-studio": { title: "No batches", body: "Upload a JSONL file of requests, pick a route and a budget, and collect results with one receipt per line." },
  models: { title: "Browse the live catalog", body: "The full catalog with prices and context sizes is read live on the models page.", cta: ["/models", "Open models"] },
  "api-keys": { title: "No keys yet", body: "Keys are issued to your wallet when the router opens. Each key will carry its own allowlist, rate limit, budget and verification policy." },
  "agent-sessions": { title: "No agent sessions", body: "An agent session is a capped, revocable spending window for an autonomous agent, closed from here at any moment." },
  receipts: { title: "No receipts yet", body: "Every routed call will leave a signed receipt here. You can already check a receipt's signature in your browser.", cta: ["/verify", "Open the receipt checker"] },
  "spend-watch": { title: "Nothing spent", body: "Daily and monthly spend per key, model and provider, with alerts before a cap is reached." },
  payments: { title: "Deposits are not open", body: "USDG deposits on Robinhood Chain open with the router. Until then this site accepts no payments of any kind." },
  holders: { title: `${BRAND.symbol} holder view`, body: `Holder features are announced with the token. The contract address is published at launch and shown in the footer.` },
  providers: { title: "No bonded providers yet", body: "Providers appear here with their bond, canary record and attestation status once bonding opens.", cta: ["/providers", "Read about providers"] },
  settings: { title: "Settings", body: "Your session is your connected wallet. Disconnect from the account menu in the header to sign out of this browser." },
};

function readHash(): Tab {
  if (typeof window === "undefined") return "overview";
  const h = window.location.hash.replace("#", "");
  return (TABS.find(([id]) => id === h)?.[0] ?? "overview") as Tab;
}

export function Workspace() {
  const { address } = useWallet();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    const sync = () => setTab(readHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const pick = (id: Tab) => {
    setTab(id);
    history.replaceState(null, "", id === "overview" ? window.location.pathname : `#${id}`);
  };

  return (
    <div>
      <div className="flex items-start gap-3 border border-line border-l-[3px] border-l-signal-deep bg-white px-4 py-3 text-[14px] text-muted">
        {address ? (
          <span>
            Signed in with <span className="font-mono text-ink">{shortAddress(address)}</span> · wallet facts are read live from {CHAIN.name}; router data opens at launch.
          </span>
        ) : (
          <span>Workspace · connect a wallet to sign in. Your wallet is your account: no email, no password.</span>
        )}
      </div>

      <div className="no-scrollbar mt-6 min-w-0 overflow-x-auto border-b border-t border-line">
        <div role="tablist" aria-label="Workspace sections" className="flex w-max">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => pick(id)}
              className={`relative whitespace-nowrap px-3.5 py-4 text-[14.5px] transition-colors ${tab === id ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {label}
              {tab === id ? <span className="absolute inset-x-3.5 bottom-0 h-[2px] bg-signal-deep" /> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">{!address ? <SignIn /> : tab === "overview" ? <Overview address={address} /> : <PreviewPanel tab={tab} />}</div>
    </div>
  );
}

function SignIn() {
  const { open } = useWalletModal();
  return (
    <div className="grid grid-cols-1 border border-line-strong lg:grid-cols-[1.05fr_1fr]">
      <div className="on-dark relative overflow-hidden bg-ink p-8 text-paper sm:p-11">
        <p className="eyebrow">Sign in</p>
        <h2 className="mt-5 text-[clamp(30px,3vw,40px)] font-[640] leading-[1.02] tracking-[-0.045em]">Connect your workspace</h2>
        <p className="mt-5 max-w-[400px] text-[16px] leading-[1.55] text-muted-dark">
          Your wallet on {CHAIN.name} is the account. Connect it to see your ETH and USDG balances here, and to hold keys and receipts once the router opens.
        </p>
        <Link href="/case-study" className="link-u mt-8 inline-block font-mono text-[11.5px] uppercase tracking-[0.06em]">
          Read an example workflow →
        </Link>
        <ProofBars className="pointer-events-none mt-10 h-16 w-full rotate-180" />
      </div>
      <div className="corner-tab bg-white p-8 sm:p-11">
        <p className="mono-label flex items-center gap-2 text-muted">
          API key <span className="chip chip-warn">Opens with the router</span>
        </p>
        <input disabled placeholder="vr-live-…" className="field mt-3 font-mono text-[14px] disabled:cursor-not-allowed disabled:opacity-60" />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={open} data-connect="dashboard" className="btn btn-cut btn-dot btn-solid-dark">
            Sign in with wallet <ArrowRight className="size-4" />
          </button>
          <button type="button" disabled className="btn btn-outline-dark">
            Use a key
          </button>
        </div>
        <p className="mt-4 text-[13px] text-muted">Connecting only shares your address. Nothing is signed or sent without your wallet asking first.</p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="border border-line bg-white p-5">
      <p className="mono-label text-muted">{label}</p>
      <p className="num mt-3 truncate text-[clamp(26px,2.6vw,34px)] font-[640] tracking-[-0.04em]">{value}</p>
      {sub ? <p className="mt-2 text-[13px] text-muted">{sub}</p> : null}
    </div>
  );
}

function Overview({ address }: { address: string }) {
  const { balance, usdg, chainId, onRobinhoodChain, switchNetwork, switching, walletName } = useWallet();
  const wrong = chainId !== null && !onRobinhoodChain;
  return (
    <div className="grid grid-cols-1 gap-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label text-muted">Your wallet · live on {CHAIN.name}</p>
          <span className="chip chip-signal">
            <i className="size-1.5 animate-pulse-dot bg-signal-deep" /> Live read
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Address" value={<span className="font-mono text-[18px] tracking-normal">{shortAddress(address, 6, 4)}</span>} sub={walletName ?? "Wallet"} />
          <Stat label={`${CHAIN.nativeSymbol} balance`} value={balance ?? "…"} sub="Gas on Robinhood Chain" />
          <Stat label="USDG balance" value={usdg ?? "…"} sub="What calls will be paid with" />
          <Stat
            label="Network"
            value={<span className={wrong ? "text-danger" : ""}>{chainId === null ? "…" : onRobinhoodChain ? "Robinhood" : `Chain ${chainId}`}</span>}
            sub={
              wrong ? (
                <button type="button" onClick={switchNetwork} disabled={switching} className="link-u text-ink">
                  {switching ? "Confirm in wallet…" : `Switch to ${CHAIN.name}`}
                </button>
              ) : (
                `Chain id ${CHAIN.id}`
              )
            }
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-[14px]">
          <a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="link-u inline-flex items-center gap-1">
            Your address on {CHAIN.explorerName} <ArrowUpRight className="size-3.5" />
          </a>
          <a href={explorerToken(USDG.address)} target="_blank" rel="noreferrer" className="link-u inline-flex items-center gap-1">
            USDG token contract <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {[
          ["API keys", "0 keys", "Keys are issued to this wallet when the router opens."],
          ["Receipts", "0 receipts", "Signed receipts for your calls will be listed here."],
          ["Spend", "0 USDG", "Nothing has been routed or billed for this wallet."],
        ].map(([label, value, body]) => (
          <div key={label} className="corner-tab border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="mono-label text-muted">{label}</p>
              <span className="chip chip-warn">Preview</span>
            </div>
            <p className="mt-4 text-[24px] font-[640] tracking-[-0.035em]">{value}</p>
            <p className="mt-2 text-[14px] leading-[1.5] text-muted">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewPanel({ tab }: { tab: Exclude<Tab, "overview"> }) {
  const p = PREVIEW[tab];
  return (
    <div className="corner-tab border border-line-strong bg-white p-8 sm:p-11">
      <span className="chip chip-warn">Preview · not live</span>
      <h2 className="mt-5 text-[clamp(26px,2.6vw,34px)] font-[640] tracking-[-0.04em]">{p.title}</h2>
      <p className="mt-3 max-w-[560px] text-[16px] leading-[1.55] text-muted">{p.body}</p>
      {p.cta ? (
        <Link href={p.cta[0]} className="btn btn-cut btn-dot btn-solid-dark mt-7">
          {p.cta[1]} <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
