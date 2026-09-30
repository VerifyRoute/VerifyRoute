import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ArrowLink, CodePanel, PageBody, PageHero, PreviewTag } from "@/components/ui/page";
import { SAMPLE_ENDPOINT } from "@/components/trust/registry-sample";

export const metadata: Metadata = {
  title: "Registry",
  description: "Attested endpoints, the measurements the router verified, and every time their software changed.",
};

const BADGE = `<script src="${BRAND.url}/badge.js" data-endpoint="<provider id or model id>" data-theme="light" async></script>`;

export default function RegistryPage() {
  return (
    <>
      <PageHero
        eyebrow="Registry / attested endpoints"
        title={
          <>
            What ran,
            <br />
            and when.
          </>
        }
        lede="Each attested endpoint with the measurement the router verified, how long it held a fresh attestation, and every time its software changed. Read from the router's public record."
      />
      <PageBody>
        <div className="max-w-[1040px]">
          <section id="endpoints">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">Attested endpoints</h2>
              <PreviewTag />
            </div>
            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-muted">
              Every provider that attests through this router will be listed here, with the measurements verified over time, so a software change shows up as a
              new version on the record.
            </p>
            <div className="mt-8 border border-dashed border-line-strong/40 bg-white/60 px-6 py-10 text-center">
              <p className="text-[20px] font-[640] tracking-[-0.03em]">No attested endpoints yet</p>
              <p className="mx-auto mt-2 max-w-[520px] text-[15px] leading-[1.55] text-muted">
                Attested lanes are on the roadmap after provider bonds. Until an endpoint attests, this list stays empty rather than showing borrowed numbers.
              </p>
            </div>
            <Link href={`/registry/${SAMPLE_ENDPOINT.id}`} className="mt-4 flex flex-col gap-2 border border-line bg-white p-5 transition-colors hover:border-ink sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="chip chip-warn mr-3">Sample</span>
                <span className="font-semibold">{SAMPLE_ENDPOINT.name}</span>
                <span className="ml-2 font-mono text-[12px] text-muted">{SAMPLE_ENDPOINT.id}</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">See what a record will look like →</span>
            </Link>
          </section>

          <section id="badge" className="mt-24">
            <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">Show it on your site</h2>
            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-muted">
              Each entry will get an embeddable badge that re-checks the record from the visitor&apos;s browser, and an image variant for places that do not run
              scripts.
            </p>
            <CodePanel title="HTML" code={BADGE} className="mt-8" />
            <div className="mt-8 flex flex-wrap gap-6">
              <ArrowLink href="/docs#badge">Badge docs</ArrowLink>
              <ArrowLink href="/verify">Verify a provider</ArrowLink>
            </div>
          </section>
        </div>
      </PageBody>
    </>
  );
}
