import { CHAIN } from "@/config/brand";
import { readChainFacts } from "@/lib/chain-server";
import { formatPrice, getCatalog } from "@/lib/models";

/** Chain facts row: read live from Robinhood Chain on each request. */
export async function ChainFactsRow() {
  const facts = await readChainFacts();
  const items = [
    <span key="c" className="flex items-center gap-2">
      <i className={`size-1.5 ${facts.ok ? "animate-pulse-dot bg-signal" : "bg-warn"}`} />
      {CHAIN.name} · {CHAIN.id}
    </span>,
    <span key="b">Block · {facts.block ? facts.block.toLocaleString("en-US") : "unreachable from here"}</span>,
    <span key="t">Block time · {facts.blockTime ? `${facts.blockTime.toFixed(2)} s` : "—"}</span>,
    <span key="s">Settlement · USDG</span>,
    <span key="r">Receipts · Ed25519</span>,
  ];
  return <>{items}</>;
}

export function ChainFactsFallback() {
  return (
    <>
      <span className="flex items-center gap-2">
        <i className="size-1.5 bg-muted-dark" />
        {CHAIN.name} · {CHAIN.id}
      </span>
      <span>Block · reading…</span>
      <span>Settlement · USDG</span>
      <span>Receipts · Ed25519</span>
    </>
  );
}

/** Scrolling list of real models from the live catalog. */
export async function ModelMarquee() {
  const catalog = await getCatalog();
  const picks = catalog.ok
    ? [...catalog.models]
        .filter((m) => m.input !== null && m.input > 0)
        .sort((a, b) => b.created - a.created)
        .slice(0, 16)
    : [];
  if (picks.length === 0) return <MarqueeFallback />;
  const row = picks.map((m) => ({ id: m.id, name: m.name, tag: `${formatPrice(m.input)} / 1M in` }));
  return <MarqueeTrack items={row} />;
}

export function MarqueeFallback() {
  const row = ["Catalog", "Reading live models", "Know", "Verify", "Route"].map((t) => ({ id: t, name: t, tag: "" }));
  return <MarqueeTrack items={row} />;
}

function MarqueeTrack({ items }: { items: { id: string; name: string; tag: string }[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden" aria-label="Models in the live catalog">
      <div className="flex w-max animate-marquee items-center gap-7 py-3.5 font-mono text-[12px] uppercase tracking-[0.06em] hover:[animation-play-state:paused]">
        {doubled.map((m, i) => (
          <span key={`${m.id}-${i}`} className="flex items-center gap-7 whitespace-nowrap" aria-hidden={i >= items.length}>
            <span>
              <b className="font-semibold text-ink">{m.name}</b>
              {m.tag ? <span className="ml-4 text-muted">{m.tag}</span> : null}
            </span>
            <span className="text-signal-deep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
