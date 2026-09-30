import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { DocShell, PageHero } from "@/components/ui/page";
import { INVENTORY } from "@/components/trust/inventory";

export const metadata: Metadata = {
  title: "What we keep",
  description: "Every place this site and the router read your data, and exactly what is kept.",
};

const TOC = [
  { id: "summary", label: "Summary" },
  { id: "site", label: "This website today" },
  { id: "router", label: "The router, by design" },
  ...INVENTORY.categories.map((c) => ({ id: c.id, label: c.label })),
  { id: "browser", label: "Your browser" },
  { id: "not-claimed", label: "What this does not claim" },
];

export default function RetentionPage() {
  return (
    <>
      <PageHero
        eyebrow="Data inventory · one source for page and JSON"
        title="What we keep."
        lede="Every place a request's text or a wallet address is read, what happens to it, and what is kept. This page and inventory.json are built from the same file, so they always say the same thing."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/retention/inventory.json" className="btn btn-cut btn-dot btn-solid-dark">
            inventory.json <ArrowRight className="size-4" />
          </Link>
          <Link href="/legal/privacy" className="btn btn-outline-dark">
            Data notice <ArrowRight className="size-4" />
          </Link>
        </div>
      </PageHero>
      <DocShell toc={TOC}>
        <div className="prose-vr">
          <h2 id="summary">The short version.</h2>
          <blockquote className="my-8 border-l-[3px] border-signal pl-6 text-[clamp(22px,2.4vw,32px)] font-[640] leading-[1.15] tracking-[-0.035em] text-ink">
            {INVENTORY.summary.statement}
          </blockquote>
          <ul>
            <li>{INVENTORY.summary.status}</li>
            <li>
              A routed call will leave a row of counts, cost and timing plus two SHA-256 hashes, of the request and of the reply, so a receipt can be checked against
              a request you hold. A hash cannot be turned back into the text.
            </li>
            <li>No table and no log line is designed to hold a network address. Rate-limit counters expire within the hour.</li>
          </ul>

          <h2 id="site">This website today.</h2>
          <p>These are the only places this site reads anything about you right now.</p>
          <div className="mt-6 grid gap-3 [&_p]:!my-0">
            {INVENTORY.site.map((row) => (
              <div key={row.where} className="border border-line bg-white p-5">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.06em]">{row.where}</p>
                <div className="mt-3 grid grid-cols-1 gap-4 text-[15px] leading-[1.55] md:grid-cols-2">
                  <div>
                    <p className="mono-label text-muted">What is read</p>
                    <p className="mt-1">{row.read}</p>
                  </div>
                  <div>
                    <p className="mono-label text-muted">What is kept</p>
                    <p className="mt-1">{row.kept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 id="router">The router, by design.</h2>
          <p>
            When the router routes calls, its storage is split into the groups below. Each group is described before it exists, and a column that could hold
            request text or an address needs a written review before it ships.
          </p>
          {INVENTORY.categories.map((c) => (
            <section key={c.id} id={c.id}>
              <h3>{c.label}</h3>
              <p>{c.summary}</p>
            </section>
          ))}

          <h2 id="browser">Your browser.</h2>
          <p>
            The wallet session sits in localStorage under one key and is removed when you disconnect. Pages that take an API key or files keep them in the
            tab&apos;s memory only; a reload clears them.
          </p>

          <h2 id="not-claimed">What this does not claim.</h2>
          <p>
            This page is about what is kept. It is not a claim that nobody reads a request while it is in flight: the router reads the text in memory to route
            it, and the provider that answers reads it too, under its own policy. Attested lanes narrow who that provider can be; they do not make the text
            invisible to the model that answers.
          </p>
        </div>
      </DocShell>
    </>
  );
}
