import Link from "next/link";
import { Suspense } from "react";
import { BRAND, CHAIN } from "@/config/brand";
import { ArrowRight, PlayIcon } from "@/components/icons";
import { Mark } from "@/components/Logo";
import { CaStrip } from "@/components/CopyCa";
import { ConnectButton } from "@/components/wallet/WalletButton";
import { HeroGraph, RouteCard } from "@/components/home/HeroRoute";
import { RouteTypes } from "@/components/home/RouteTypes";
import { KeyPolicy } from "@/components/home/KeyPolicy";
import { AttestFlow } from "@/components/home/AttestFlow";
import { ChainFactsFallback, ChainFactsRow, MarqueeFallback, ModelMarquee } from "@/components/home/LiveStrip";
import { CodePanel, SectionHead } from "@/components/ui/page";
import { FeatureIcon } from "@/components/home/FeatureIcon";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <Strip />
      <Stats />
      <Features />
      <section id="routes" className="section bg-paper-2">
        <div className="wrap">
          <SectionHead
            eyebrow="Route types"
            title={
              <>
                One request.
                <br />
                Four routes.
              </>
            }
            lede="The same request body can take an open lane, an attested private lane, a verified-only lane or an agent's pay-per-call lane. Pick it with a model suffix, a header or a key policy."
          />
          <RouteTypes />
        </div>
      </section>
      <Flow />
      <Accountability />
      <Gateway />
      <Privacy />
      <CaseStudy />
      <Roadmap />
      <About />
      <Developers />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="on-dark relative -mt-[var(--header)] overflow-hidden bg-ink pt-[var(--header)] text-paper">
      <div className="gridlines absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_0%,rgba(31,225,90,0.14),transparent_70%)]" aria-hidden="true" />
      <div className="wrap relative">
        <div className="relative flex flex-col lg:block lg:min-h-[860px]">
          <HeroGraph className="relative order-first -mx-4 h-[360px] sm:h-[460px] lg:absolute lg:-right-6 lg:top-0 lg:mx-0 lg:h-[820px] lg:w-[62%]" />
          <div className="relative pb-12 pt-4 lg:pb-16 lg:pt-[72px]">
            <p className="kicker">
              <span className="text-signal">▲</span> OpenAI-compatible API · {CHAIN.name}
            </p>
            <h1 className="display relative mt-9 max-w-[880px]">
              <span className="block">Know.</span>
              <span className="block">Verify.</span>
              <span className="block text-signal">Route.</span>
              <span className="absolute -left-5 -top-4 hidden size-5 border-l border-t border-paper/40 lg:block" aria-hidden="true" />
            </h1>
            <p className="lede mt-10 max-w-[560px] text-muted-dark">
              {BRAND.tagline}. Reach hundreds of models with <b className="font-medium text-paper">one API key and one USDG balance</b>, and get a
              signed receipt that proves who served each call and what it cost.
            </p>
            <p className="lede mt-3 max-w-[560px] text-muted-dark">No blind trust. Trust through cryptographic proof.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ConnectButton className="btn btn-cut btn-dot btn-solid-light">
                Connect wallet <ArrowRight className="size-4" />
              </ConnectButton>
              <Link href="/docs" className="btn btn-outline-light">
                Read the docs <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-2.5 text-[14px] text-muted-dark">
              <Link href="/console" className="link-u w-fit">
                Or try any model and its tools on one page →
              </Link>
              <Link href="/veil" className="link-u w-fit">
                Read VEIL, the privacy protocol, and its open spec →
              </Link>
            </div>
            <div className="mt-8 max-w-[520px]">
              <CaStrip />
            </div>
          </div>
          <RouteCard className="relative mb-12 w-full lg:absolute lg:bottom-12 lg:right-0 lg:mb-0 lg:w-[330px]" />
        </div>
      </div>
    </section>
  );
}

function Strip() {
  return (
    <>
      <div className="border-y border-line-dark bg-ink">
        <div className="wrap flex flex-wrap gap-x-9 gap-y-3 py-[18px] font-mono text-[11px] uppercase tracking-[0.06em] text-muted-dark">
          <Suspense fallback={<ChainFactsFallback />}>
            <ChainFactsRow />
          </Suspense>
        </div>
      </div>
      <div className="border-b border-line bg-paper">
        <Suspense fallback={<MarqueeFallback />}>
          <ModelMarquee />
        </Suspense>
      </div>
    </>
  );
}

function Stats() {
  const stats = [
    { big: "1", sup: "key", body: "One API key reaches every model in the live catalog.", label: "Know" },
    { big: "1", sup: "USDG", body: "One USDG balance on Robinhood Chain pays for all of it.", label: "Settle" },
    { big: "10k", sup: "USDG", body: "Bond each provider posts before it may serve traffic.", label: "Verify" },
    { big: "4", sup: "checks", body: "Bond, canary, signed receipt and TEE attestation per call.", label: "Proof" },
  ];
  return (
    <section className="section-tight">
      <div className="wrap">
        <div className="grid grid-cols-1 border-t border-line-strong sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`border-line py-8 sm:px-6 lg:py-2 lg:pt-10 ${i ? "border-t sm:border-t-0" : ""} ${i % 2 ? "sm:border-l" : ""} ${i >= 2 ? "sm:border-t lg:border-t-0" : ""} lg:border-l lg:first:border-l-0 lg:first:pl-0`}>
              <p className="flex items-start text-[clamp(64px,6vw,88px)] font-[640] leading-[0.9] tracking-[-0.06em]">
                {s.big}
                <span className="ml-1.5 mt-1 text-[clamp(20px,2vw,30px)] tracking-[-0.03em] text-signal-deep">{s.sup}</span>
              </p>
              <p className="mt-6 max-w-[230px] text-[14px] leading-[1.45] text-muted">{s.body}</p>
              <p className="mono-label mt-5 text-muted">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
          Protocol design values. Bonds and canaries go live with provider onboarding; see the roadmap.
        </p>
      </div>
    </section>
  );
}

const FEATURES = [
  { n: "01", tag: BRAND.name, title: "The verified routing layer", body: "Hundreds of models, many providers, one route you can check. Know where a call went, what it cost and why it can be trusted.", span: 2, dark: true, icon: "mark" },
  { n: "02", tag: "Open API", title: "Your client, unchanged", body: "Keep the chat-completions shape your code already speaks. Swap the base URL and the key; streaming and tools behave as before.", icon: "code" },
  { n: "03", tag: "USDG balance", title: "One balance for every model", body: "Fund once in USDG on Robinhood Chain and spend it on any model. Withdraw what you do not use.", icon: "coin" },
  { n: "04", tag: "Signed receipts", title: "Proof that travels with the answer", body: "Each response carries an Ed25519 receipt: model, provider, tokens, cost and hashes of the request and reply. Roots are anchored on Robinhood Chain so anyone can check them later.", span: 2, icon: "receipt" },
  { n: "05", tag: "Provider bonds", title: "10,000 USDG at stake", body: "A provider bonds 10k USDG before it serves live traffic. Broken promises cost money, on evidence.", icon: "bond" },
  { n: "06", tag: "Quality canaries", title: "Tested around the clock", body: "Automated canary prompts check every served model for swapped weights, quantization and empty replies.", icon: "canary" },
  { n: "07", tag: "TEE attestation", title: "Privacy you can check", body: "Private lanes only reach hosts whose enclave quote was verified minutes ago. The quote hash lands in your receipt.", icon: "shield" },
  { n: "08", tag: "Agent payments", title: "HTTP 402 for agents", body: "An agent with no account gets a price, pays from its wallet and retries with the payment proof.", icon: "agent" },
  { n: "09", tag: "Fallback routing", title: "The request keeps moving", body: "Filter by price, speed, context and data policy. A provider that fails health checks or canaries drops out of the pool, and the next verified one answers.", span: 2, dark: true, icon: "route" },
  { n: "10", tag: "Virtual keys", title: "A budget per workload", body: "Every key carries its own model allowlist, rate limit and spend cap.", icon: "key" },
  { n: "11", tag: "Open telemetry", title: "Usage in your own tools", body: "Export spans and usage records to the observability stack you already run.", icon: "chart" },
  { n: "12", tag: "Team controls", title: "Shared, not shared-out", body: "Roles and budgets for everyone building on the same workspace.", icon: "team" },
  { n: "13", tag: "Public registry", title: "Every measurement on record", body: "Attested endpoints and their software changes kept in a public log.", icon: "log" },
] as const;

function Features() {
  return (
    <section className="section pt-0 lg:pt-12">
      <div className="wrap">
        <SectionHead
          eyebrow="Features / what a route proves"
          title={
            <>
              Every call should
              <br />
              arrive with proof.
            </>
          }
          lede="Routing, settlement, verification and privacy in one layer. Keep your SDK and gain a receipt, a budget and evidence about who served you."
        />
        <div className="mt-16 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const dark = "dark" in f && f.dark;
            const span = "span" in f && f.span === 2;
            return (
              <article
                key={f.n}
                className={`corner-tab relative flex min-h-[300px] flex-col border-b border-r border-line p-6 ${dark ? "corner-green bg-ink text-paper" : "bg-paper"} ${span ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <FeatureIcon kind={f.icon} dark={dark} />
                  <span className={`font-mono text-[11px] ${dark ? "text-muted-dark" : "text-muted"}`}>{f.n}</span>
                </div>
                <div className="mt-auto pt-10">
                  <p className={`mono-label ${dark ? "text-muted-dark" : "text-muted"}`}>{f.tag}</p>
                  <h3 className="h-card mt-3">{f.title}</h3>
                  <p className={`mt-3 text-[15px] leading-[1.5] ${dark ? "text-muted-dark" : "text-muted"}`}>{f.body}</p>
                </div>
              </article>
            );
          })}
          <article className="hidden border-b border-r border-line bg-paper-2/60 p-6 lg:col-span-4 lg:flex lg:items-center lg:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Know the model · Verify the provider · Route the call</p>
            <Link href="/docs" className="link-u text-[14px]">
              Read how each check works →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function Flow() {
  const steps = [
    { k: "Know", t: "Pick a model.", b: "Search the live catalog, compare prices and context, then send the request shape you already use.", c: "model · provider{} · budget" },
    { k: "Verify", t: "Check the provider.", b: "Before a call is routed, the provider's bond, canary record and, on private lanes, its enclave quote are checked.", c: "bond ≥ 10k · canary ✓ · tee ✓" },
    { k: "Route", t: "Keep the receipt.", b: "The best verified provider answers. Usage, cost and hashes come back signed, and roots are anchored on-chain.", c: "ed25519 · merkle · 4663" },
  ];
  return (
    <section id="flow" className="section">
      <div className="wrap">
        <SectionHead
          eyebrow="The Flow"
          title={
            <>
              Three checks.
              <br />
              One request.
            </>
          }
          lede="Point your client at the router and keep your code. Every call passes through Know, Verify and Route, and comes back with the proof of each."
        />
        <div className="relative mt-16 lg:mt-24">
          <div className="absolute left-0 right-0 top-[5px] hidden h-px bg-line lg:block" />
          <div className="absolute left-0 top-[4.5px] hidden h-[2px] w-[88%] bg-signal-deep lg:block" />
          <span className="absolute right-[12%] top-0 hidden size-[11px] bg-signal lg:block" />
          <ol className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
            {steps.map((s, i) => (
              <li key={s.k} className="relative border-l border-line pl-6 lg:border-l-0 lg:pl-0 lg:pt-12">
                <span className="absolute -left-[6px] top-1 size-[11px] rotate-45 border border-signal-deep bg-signal/80 lg:left-1 lg:top-0" />
                <p className="mono-label text-muted">
                  Step {String(i + 1).padStart(2, "0")} · {s.k}
                </p>
                <h3 className="mt-4 text-[clamp(28px,2.6vw,36px)] font-[640] leading-[1] tracking-[-0.045em]">{s.t}</h3>
                <p className="mt-4 max-w-[340px] text-[16px] leading-[1.55] text-muted">{s.b}</p>
                <p className="mt-5 inline-block border border-line bg-white/60 px-2.5 py-1.5 font-mono text-[11.5px]">{s.c}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const LOG: [string, "pass" | "warn" | "fail" | "open", string, string][] = [
  ["09:00:02", "pass", "weights fingerprint · llama-3.3-70b", "fp8 = fp8"],
  ["09:00:05", "pass", "exact-answer canary set", "12 / 12"],
  ["09:00:09", "pass", "empty-reply rate · 24h", "0.03%"],
  ["09:00:14", "warn", "p50 latency drift · 1h", "+19%"],
  ["09:00:31", "pass", "receipt root anchored", "0x2d7a…c4e1"],
  ["09:01:06", "fail", "weights fingerprint · qwen3-32b", "bf16 ≠ int4"],
  ["09:01:06", "fail", "canary replies mismatched", "3 of 3"],
  ["09:01:08", "open", "slash proposal · 25% of bond", "72h dispute"],
];

function Accountability() {
  const color = { pass: "text-signal", warn: "text-warn", fail: "text-danger", open: "text-paper" } as const;
  return (
    <section id="accountability" className="section on-dark bg-ink text-paper">
      <div className="wrap grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">Verify / bonds and canaries</p>
          <h2 className="h-section mt-6">
            Trust is posted,
            <br />
            not promised.
          </h2>
          <p className="lede mt-8 max-w-[520px] text-muted-dark">
            Providers lock money behind what they claim to serve. Canary prompts test every model they host, and each result is kept as evidence before any
            penalty is proposed.
          </p>
          <ul className="mt-10 border-t border-line-dark">
            {[
              ["Provider bonds", "10,000 USDG per provider, posted on Robinhood Chain. Reliability has a price, and failures leave a trail."],
              ["Quality canaries", "Automated tests compare the declared weights, quantization and quality, with a dispute window before any slash."],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-5 border-b border-line-dark py-6">
                <PlayIcon className="mt-2 shrink-0 text-signal" />
                <div>
                  <h3 className="text-[21px] font-[620] tracking-[-0.025em]">{t}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.5] text-muted-dark">{b}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 border border-line-dark bg-ink-2 font-mono text-[11.5px]">
          <div className="flex items-center justify-between gap-3 border-b border-line-dark px-4 py-3.5 uppercase tracking-[0.06em]">
            <span>
              Evidence log <span className="text-muted-dark">· illustration</span>
            </span>
            <span className="hidden text-muted-dark sm:inline">prov_4c19 · hourly</span>
          </div>
          <ul className="px-4 py-2">
            {LOG.map(([time, state, what, value], i) => (
              <li key={i} className="grid grid-cols-[62px_38px_minmax(0,1fr)] items-baseline gap-2 border-b border-dashed border-line-dark py-2 last:border-0 sm:grid-cols-[70px_42px_minmax(0,1fr)_auto]">
                <span className="text-muted-dark">{time}</span>
                <span className={`uppercase ${color[state]}`}>{state}</span>
                <span className="truncate">{what}</span>
                <span className="col-start-3 text-muted-dark sm:col-start-auto">{value}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-line-dark px-4 py-4">
            <div className="flex justify-between uppercase tracking-[0.06em]">
              <span className="text-muted-dark">Provider bond</span>
              <span>10,000 USDG</span>
            </div>
            <div className="mt-2 flex justify-between uppercase tracking-[0.06em]">
              <span className="text-muted-dark">At stake in dispute</span>
              <span className="text-warn">2,500 USDG</span>
            </div>
            <div className="mt-4 h-2 bg-[repeating-linear-gradient(90deg,#2a2e2a_0_3px,transparent_3px_5px)]">
              <div className="h-full w-1/4 bg-[repeating-linear-gradient(90deg,#f3b43f_0_3px,transparent_3px_5px)]" />
            </div>
            <ol className="mt-4 grid grid-cols-2 border border-line-dark sm:grid-cols-4">
              {["Evidence", "Proposal", "72h dispute", "Slash or refund"].map((s, i) => (
                <li key={s} className={`px-3 py-2.5 ${i ? "border-line-dark sm:border-l" : ""} ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} ${i === 2 ? "border-t-2 border-t-warn bg-ink-3 sm:border-t-2" : ""}`}>
                  <span className={i === 2 ? "text-warn" : "text-signal"}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-1">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gateway() {
  return (
    <section id="gateway" className="section">
      <div className="wrap grid grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <KeyPolicy />
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow">Gateway / policy per key</p>
          <h2 className="h-section mt-6">
            Every control on.
            <br />
            Any control off.
          </h2>
          <p className="lede mt-8 max-w-[520px] text-muted">
            Policy belongs to the key, not your code. Require verified providers, force the attested lane, cap the spend, and switch off whatever you do not need.
          </p>
          <ul className="mt-10 border-t border-line">
            {[
              ["Bring your own workflow", "Keep your SDK, name your providers, set fallbacks. Caching and guardrails are opt-in."],
              ["Built for autonomous agents", "Virtual keys, spend caps and rate limits draw a boundary around each workload."],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-5 border-b border-line py-6">
                <PlayIcon className="mt-2 shrink-0 text-signal-deep" />
                <div>
                  <h3 className="text-[21px] font-[620] tracking-[-0.025em]">{t}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.5] text-muted">{b}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className="section bg-paper-2">
      <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">Privacy / TEE attestation</p>
          <h2 className="h-section mt-6">
            Private lanes,
            <br />
            proven by hardware.
          </h2>
          <p className="lede mt-8 max-w-[540px] text-muted">
            An attested request goes only to a host whose enclave evidence was checked minutes ago. If the evidence is missing or stale, the request fails closed
            instead of falling back.
          </p>
          <ul className="mt-10 border-t border-line">
            {[
              ["Attested private lane", "Only freshly attested TEE hosts qualify. The quote hash is written into the receipt."],
              ["Declared data policy", "Read each provider's data policy before routing, and see which parts are proven and which are only declared."],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-5 border-b border-line py-6">
                <PlayIcon className="mt-2 shrink-0 text-signal-deep" />
                <div>
                  <h3 className="text-[21px] font-[620] tracking-[-0.025em]">{t}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.5] text-muted">{b}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/verify" className="link-u mt-8 inline-block text-[15px]">
            See what the router has verified about a provider
          </Link>
        </div>
        <AttestFlow />
      </div>
    </section>
  );
}

function CaseStudy() {
  const rows: [string, string][] = [
    ["model", "llama-3.3-70b"],
    ["provider", "attested host"],
    ["tokens", "142 in · 88 out"],
    ["bond", "10,000 USDG"],
    ["canary", "pass · 24h"],
    ["settlement", "USDG"],
    ["anchor", "chain 4663"],
  ];
  return (
    <section id="case-study" className="section">
      <div className="wrap">
        <SectionHead
          eyebrow="Case study / an audited agent"
          title={
            <>
              From one call
              <br />
              to a checked receipt.
            </>
          }
          lede="An example agent workflow: a research agent that must prove to its operator which model answered, what it cost and that the host was attested."
        />
        <div className="mt-16 grid grid-cols-1 bg-ink-2 text-paper lg:mt-20 lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="mono-label text-muted-dark">The workflow</p>
            <h3 className="mt-6 text-[clamp(28px,3vw,40px)] font-[640] leading-[1.02] tracking-[-0.045em]">
              Your request stays the same.
              <br />
              Your evidence gets a paper trail.
            </h3>
            <p className="mt-6 max-w-[440px] text-[16px] leading-[1.6] text-muted-dark">
              The agent calls a model through {BRAND.name} with a verified-only key. The router checks the provider&apos;s bond and canaries, routes the call, signs
              the receipt and anchors it. The operator checks the signature in a browser, without asking anyone.
            </p>
            <Link href="/case-study" className="btn btn-cut btn-dot btn-solid-light mt-10">
              Read the case study <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative flex items-center justify-center border-t border-line-dark p-8 sm:p-12 lg:border-l lg:border-t-0">
            <p className="eyebrow on-dark absolute left-8 top-8 sm:left-12">Illustrative receipt</p>
            <div className="mt-10 w-full max-w-[330px] bg-paper p-5 font-mono text-[11.5px] text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] lg:mt-6">
              <div className="flex items-center justify-between border-b border-ink pb-3">
                <span className="flex items-center gap-2 font-sans text-[15px] font-[640] tracking-[-0.03em]">
                  <Mark size={18} /> {BRAND.name}
                </span>
                <span className="text-muted">gen-2027114</span>
              </div>
              <dl className="py-2">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-dashed border-line py-[7px]">
                    <dt className="text-muted">{k}</dt>
                    <dd className={k === "bond" || k === "canary" ? "text-signal-deep" : ""}>{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between border-t border-ink pt-2.5 font-semibold">
                  <dt>cost</dt>
                  <dd>0.00004112 USDG</dd>
                </div>
              </dl>
              <p className="mt-2 text-[10px] leading-[1.5] text-muted">sig ed25519 · 9Qx4b…Tz0= · key 7f21ac03</p>
              <div className="mt-3 h-9 bg-[repeating-linear-gradient(90deg,#0b0c0b_0_2px,transparent_2px_4px,#0b0c0b_4px_5px,transparent_5px_8px)]" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  const stages = [
    { n: "01", s: "Live", t: "Know", b: "Live model catalog, wallet sign-in on Robinhood Chain, USDG balance reading and the public docs.", live: true },
    { n: "02", s: "Building", t: "Verify", b: "Signed receipts, a browser receipt checker, canary suites and the public evidence log." },
    { n: "03", s: "Next", t: "Bond", b: "Provider bonds of 10k USDG on Robinhood Chain, disputes with a 72-hour window, first bonded providers." },
    { n: "04", s: "Planned", t: "Attest", b: "TEE-attested private lanes, the VEIL protocol, blind credits and the attested endpoint registry." },
  ];
  return (
    <section id="roadmap" className="section bg-paper-2">
      <div className="wrap">
        <SectionHead
          eyebrow="Roadmap / build status"
          title={
            <>
              Know first.
              <br />
              Then prove it.
            </>
          }
          lede="Stage one runs on this site today. The verification stages ship in order, and nothing below is live until it says so. No release dates are promised."
        />
        <div className="relative mt-16 lg:mt-20">
          <div className="h-px bg-line-strong/25">
            <div className="h-[2px] w-[22%] bg-signal-deep" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((s) => (
              <article key={s.n} className="flex flex-col border border-line-strong bg-paper">
                <div className="p-6">
                  <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                    {s.n} <i className={`size-1.5 ${s.live ? "bg-signal" : "bg-muted/40"}`} /> {s.s}
                  </p>
                  <h3 className="h-card mt-4">{s.t}</h3>
                  <p className="mt-3 text-[15px] leading-[1.5] text-muted">{s.b}</p>
                </div>
                <div className="mt-auto h-3 bg-ink">
                  <div className={`h-[3px] translate-y-[9px] bg-signal ${s.live ? "w-full" : "w-[18%] opacity-40"}`} />
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 border border-dashed border-line-strong/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px]">Token launch on Robinhood Chain, then provider bonds open to the first operators.</p>
            <span className="chip chip-solid w-fit">Next</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="flex justify-center text-ink lg:justify-start">
          <Mark size={420} className="h-auto w-[62%] max-w-[420px] lg:w-full" />
        </div>
        <div>
          <p className="eyebrow">About {BRAND.name}</p>
          <h2 className="mt-6 text-[clamp(40px,4.6vw,66px)] font-[640] leading-[0.98] tracking-[-0.045em]">
            Know the model.
            <br />
            Verify the provider.
            <br />
            Route the call.
          </h2>
          <p className="mt-8 max-w-[600px] text-[17px] leading-[1.6] text-muted">
            {BRAND.name} is an inference router on {CHAIN.name}. The familiar API gets you in the door. What keeps you is evidence: bonded providers, tested models,
            signed receipts and attested hardware.
          </p>
          <blockquote className="mt-10 border-l-[3px] border-signal pl-6 text-[clamp(22px,2.2vw,28px)] font-[620] leading-[1.2] tracking-[-0.03em]">
            An answer is only as good as your ability to check where it came from.
          </blockquote>
          <p className="mt-10 max-w-[600px] text-[17px] leading-[1.6] text-muted">
            Which provider served it? Was that the model they claimed? What did it cost? Could anyone else read the prompt? Routing, USDG settlement, receipts and
            attestation checks answer those questions in the router, with bonds and anchors on {CHAIN.name}.
          </p>
          <Link href="/docs" className="btn btn-cut btn-dot btn-solid-dark mt-10">
            Read the documentation <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const QUICKSTART = `// Two lines change: the base URL and the key.
const client = new OpenAI({
  baseURL: process.env.VERIFYROUTE_BASE_URL, // "https://verifyroute.tech/api/v1"
  apiKey: process.env.VERIFYROUTE_API_KEY,   // "vr-live-…"
});

const answer = await client.chat.completions.create({
  model: "meta-llama/llama-3.3-70b-instruct",
  messages: [{ role: "user", content: "Hello, Verify Route." }],
});

answer.receipt; // signed, itemized, checkable`;

function Developers() {
  return (
    <section id="developers" className="section bg-paper-2">
      <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">Built for developers</p>
          <h2 className="h-section mt-6">
            The shape you know.
            <br />
            The proof you lacked.
          </h2>
          <p className="lede mt-8 max-w-[520px] text-muted">
            Keep your request shape. Point the client at <code className="bg-paper-3 px-1.5 py-0.5 text-[0.9em]">/api/v1</code> and use a {BRAND.name} key.
            Streaming, tools, structured output and provider preferences behave as expected.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/console" className="btn btn-cut btn-dot btn-solid-dark">
              Try the console <ArrowRight className="size-4" />
            </Link>
            <Link href="/docs" className="btn btn-outline-dark">
              API documentation <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <CodePanel title="Quickstart · node" code={QUICKSTART}>
          <span className="tok-c">{"// Two lines change: the base URL and the key."}</span>
          {"\n"}
          <span className="tok-k">const</span> client = <span className="tok-k">new</span> OpenAI({"{\n  baseURL: process.env.VERIFYROUTE_BASE_URL, "}
          <span className="tok-c">{'// "https://verifyroute.tech/api/v1"'}</span>
          {"\n  apiKey: process.env.VERIFYROUTE_API_KEY,   "}
          <span className="tok-c">{'// "vr-live-…"'}</span>
          {"\n});\n\n"}
          <span className="tok-k">const</span> answer = <span className="tok-k">await</span> client.chat.completions.create({"{\n  model: "}
          <span className="tok-s">&quot;meta-llama/llama-3.3-70b-instruct&quot;</span>
          {",\n  messages: [{ role: "}
          <span className="tok-s">&quot;user&quot;</span>, content: <span className="tok-s">&quot;Hello, Verify Route.&quot;</span>
          {" }],\n});\n\nanswer.receipt; "}
          <span className="tok-c">{"// signed, itemized, checkable"}</span>
        </CodePanel>
      </div>
    </section>
  );
}
