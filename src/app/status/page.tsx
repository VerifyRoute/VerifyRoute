import type { Metadata } from "next";
import { Suspense } from "react";
import { CHAIN, USDG, explorerToken } from "@/config/brand";
import { readChainFacts } from "@/lib/chain-server";
import { ArrowLink, LiveTag, PageBody, PageHero, PreviewTag } from "@/components/ui/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proof-time",
  description: "Uptime is not proof. How long each attested endpoint held a fresh attestation, plus live Robinhood Chain facts.",
};

function Fact({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="bg-white p-5">
      <p className="mono-label text-muted">{label}</p>
      <p className="num mt-3 truncate text-[clamp(24px,2.4vw,32px)] font-[640] tracking-[-0.04em]">{value}</p>
      {sub ? <p className="mt-1.5 text-[13px] text-muted">{sub}</p> : null}
    </div>
  );
}

async function ChainFacts() {
  const f = await readChainFacts();
  if (!f.ok) {
    return (
      <div className="mt-6 border border-line border-l-[3px] border-l-warn bg-white px-5 py-4 text-[15px] leading-[1.55]">
        {CHAIN.name} could not be reached from this server just now ({new Date(f.readAt).toUTCString()}). Nothing is cached from a failed read; reload to try
        again.
      </div>
    );
  }
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        <Fact label="Latest block" value={f.block?.toLocaleString("en-US") ?? "—"} sub={`Chain id ${CHAIN.id}`} />
        <Fact label="Block time" value={f.blockTime ? `${f.blockTime.toFixed(2)} s` : "—"} sub="Average over the last 2,000 blocks" />
        <Fact label="Gas price" value={f.gasPriceGwei !== null ? `${f.gasPriceGwei < 0.01 ? f.gasPriceGwei.toFixed(4) : f.gasPriceGwei.toFixed(3)} gwei` : "—"} />
        <Fact
          label="USDG supply"
          value={f.usdgSupply !== null ? f.usdgSupply.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—"}
          sub={
            <a href={explorerToken(USDG.address)} target="_blank" rel="noreferrer" className="link-u">
              totalSupply() on {CHAIN.explorerName}
            </a>
          }
        />
        <Fact label="RPC round trip" value={f.latencyMs !== null ? `${f.latencyMs} ms` : "—"} sub="From this server, one batched read" />
        <Fact label="Read at" value={<span className="font-mono text-[16px] tracking-normal">{new Date(f.readAt).toISOString().slice(11, 19)} UTC</span>} sub="Fresh on every page load" />
      </div>
    </>
  );
}

function ChainFallback() {
  return <div className="mt-6 border border-line bg-white px-5 py-6 font-mono text-[12px] uppercase tracking-[0.06em] text-muted">Reading {CHAIN.name}…</div>;
}

export default function StatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Status / proof-time"
        title={
          <>
            Uptime is a claim.
            <br />
            Proof-time is a record.
          </>
        }
        lede="Being reachable is not the same as being verified. For each endpoint in a confidential virtual machine, this is how long the router actually held a fresh attestation it checked itself. Every gap is listed as a gap."
      />
      <PageBody>
        <div className="max-w-[1040px]">
          <section id="chain">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">{CHAIN.name}</h2>
              <LiveTag />
            </div>
            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-muted">
              Settlement, bonds and receipt anchors live on {CHAIN.name}. These values are read from the chain when this page loads.
            </p>
            <Suspense fallback={<ChainFallback />}>
              <ChainFacts />
            </Suspense>
          </section>

          <section id="proof-time" className="mt-24">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">Attested endpoints</h2>
              <PreviewTag />
            </div>
            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-muted">
              Each endpoint will get a 24-hour and a 7-day bar: green where a fresh attestation was held, red where a check failed, hatched where nothing is
              known. Unknown time is never counted as covered.
            </p>
            <div className="mt-6 border border-line bg-white p-6">
              <div className="flex items-end justify-between">
                <p className="mono-label text-muted">Last 24 hours · legend</p>
                <p className="text-[30px] font-[640] leading-none tracking-[-0.04em] text-muted/50">—</p>
              </div>
              <div className="mt-3 flex h-8 gap-[2px]">
                {Array.from({ length: 48 }, (_, i) => (
                  <span key={i} className="flex-1 bg-[repeating-linear-gradient(135deg,#e2e2d9_0_3px,#ecece5_3px_6px)]" />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted">
                <span>24 h ago</span>
                <span>now</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-5 text-[13px] text-muted">
                <span className="flex items-center gap-2">
                  <i className="size-3 bg-signal-deep" /> Fresh attestation held
                </span>
                <span className="flex items-center gap-2">
                  <i className="size-3 bg-danger" /> Check failed
                </span>
                <span className="flex items-center gap-2">
                  <i className="size-3 bg-paper-3" /> Unknown, not counted
                </span>
              </div>
              <p className="mt-6 border-t border-line pt-5 text-[15px]">
                No endpoint attests through this router yet, so there is no proof-time to show. This panel fills in from the public record when the first attested
                lane opens.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <ArrowLink href="/registry">Open the registry</ArrowLink>
              <ArrowLink href="/verify">Verify a provider</ArrowLink>
            </div>
          </section>
        </div>
      </PageBody>
    </>
  );
}
