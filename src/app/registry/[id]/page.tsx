import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRAND } from "@/config/brand";
import { ArrowLink, CodePanel, PageBody, PageHero } from "@/components/ui/page";
import { SAMPLE_ENDPOINT } from "@/components/trust/registry-sample";

export function generateStaticParams() {
  return [{ id: SAMPLE_ENDPOINT.id }];
}

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Sample registry record",
  description: "The shape of an attested endpoint record in the registry. Sample data.",
};

export default async function RegistryEntry({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== SAMPLE_ENDPOINT.id) notFound();
  const e = SAMPLE_ENDPOINT;
  const script = `<script src="${BRAND.url}/badge.js" data-endpoint="${e.id}" data-theme="light" async></script>`;
  const img = `<img src="${BRAND.url}/api/v1/badge/${e.id}.svg" alt="${BRAND.name} attestation status" height="48">`;
  const md = `[![${BRAND.name} attestation status](${BRAND.url}/api/v1/badge/${e.id}.svg)](${BRAND.url}/registry/${e.id})`;

  return (
    <>
      <PageHero
        eyebrow="Registry / sample record"
        title={e.name}
        lede="Every attestation check the router ran for an endpoint, the software measurements it verified, and the badge that shows it on your site. This record is a sample: it shows the format, not a real endpoint."
      />
      <PageBody>
        <div className="max-w-[1040px]">
          <section className="border border-line-strong bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[clamp(24px,2.6vw,32px)] font-[640] tracking-[-0.04em]">{e.name}</h2>
              <span className="font-mono text-[12px] text-muted">{e.id}</span>
              <span className="chip chip-warn">Sample · not attested</span>
            </div>
            <p className="mt-3 text-[15.5px] text-muted">
              A live record shows here whether the router holds a fresh attestation it verified itself, and when it last checked.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {["Last 24 hours", "Last 7 days"].map((w) => (
                <div key={w}>
                  <div className="flex items-end justify-between">
                    <p className="mono-label text-muted">{w}</p>
                    <p className="text-[34px] font-[640] leading-none tracking-[-0.04em] text-muted/50">—</p>
                  </div>
                  <div className="mt-3 h-8 bg-[repeating-linear-gradient(135deg,#e2e2d9_0_4px,#ecece5_4px_8px)]" />
                  <p className="mt-2 text-[13px] text-muted">No record yet. Unknown time is shown hatched and never counted either way.</p>
                </div>
              ))}
            </div>
            <dl className="mt-8 border-t border-line">
              {[
                ["Hardware", e.hardware],
                ["GPU evidence", e.gpu],
                ["Last failed check", "No record"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-1 gap-1 border-b border-line py-3.5 sm:grid-cols-[220px_minmax(0,1fr)]">
                  <dt className="mono-label text-muted">{k}</dt>
                  <dd className="text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-16">
            <h2 className="text-[clamp(28px,3vw,36px)] font-[640] tracking-[-0.04em]">Measurement versions</h2>
            <p className="mt-3 max-w-[720px] text-[15.5px] leading-[1.6] text-muted">
              Each distinct software measurement the router verified, newest first. A measurement is the compose hash of the pinned deployment, or the image digest
              when there is none. Values below are placeholders.
            </p>
            <ul className="mt-6 grid gap-3">
              {e.measurements.map((m) => (
                <li key={m.digest} className="border border-line bg-white p-4">
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="chip">{m.label}</span>
                    <span className="break-all font-mono text-[13px]">{m.digest}</span>
                  </p>
                  <p className="mt-2 text-[14px] text-muted">{m.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="text-[clamp(28px,3vw,36px)] font-[640] tracking-[-0.04em]">History</h2>
            <p className="mt-3 max-w-[720px] text-[15.5px] leading-[1.6] text-muted">
              Every check, newest first. Runs of the same result fold into one line; a failure or a measurement change always gets its own.
            </p>
            <ol className="mt-6 border-l-2 border-line pl-5">
              {e.history.map((h) => (
                <li key={h.when} className="relative py-3">
                  <span className="absolute -left-[26px] top-[18px] size-2.5 bg-muted/40" />
                  <p className="mono-label text-muted">{h.when}</p>
                  <p className="mt-1 text-[15px]">{h.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="badge" className="mt-16">
            <h2 className="text-[clamp(28px,3vw,36px)] font-[640] tracking-[-0.04em]">Badge</h2>
            <p className="mt-3 max-w-[720px] text-[15.5px] leading-[1.6] text-muted">
              The script reads the public record from each visitor&apos;s browser, checks that the attestation is fresh and the records agree, and shows Attested
              only when every check passes. The badge endpoints open with the registry.
            </p>
            <div className="mt-6 grid gap-6">
              <CodePanel title="HTML · script badge, checks in the browser" code={script} />
              <CodePanel title="HTML · image badge, no script" code={img} />
              <CodePanel title="Markdown · README or model card" code={md} />
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <ArrowLink href="/registry">Back to the registry</ArrowLink>
              <ArrowLink href="/status">Proof-time</ArrowLink>
            </div>
          </section>
        </div>
      </PageBody>
    </>
  );
}
