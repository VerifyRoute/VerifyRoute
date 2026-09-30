import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { ArrowLink, CodePanel, PageBody, PageHero, PreviewTag } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Transparency log checkpoint",
  description: "The signed head of the receipt transparency log. Not published yet.",
};

const FORMAT = `${BRAND.domain}/receipts/v1
<tree size, decimal>
<root hash, base64 SHA-256>

— ${BRAND.domain} <key id> <Ed25519 signature, base64>`;

export default function CheckpointPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparency log / checkpoint"
        title={
          <>
            The log&apos;s head,
            <br />
            signed.
          </>
        }
        lede={`Every receipt the router signs is appended to a Merkle log. A checkpoint is the signed size and root of that log; its root is anchored on ${CHAIN.name} every hour, so a missing or rewritten receipt shows up.`}
      />
      <PageBody>
        <div className="max-w-[820px]">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[clamp(28px,3vw,36px)] font-[640] tracking-[-0.04em]">Latest checkpoint</h2>
            <PreviewTag>Not published yet</PreviewTag>
          </div>
          <div className="mt-6 border border-line border-l-[3px] border-l-warn bg-white px-5 py-4 text-[15px] leading-[1.55]">
            The log starts with the first routed call. There is no checkpoint to serve yet, and none is invented here.
          </div>
          <h2 className="mt-16 text-[clamp(28px,3vw,36px)] font-[640] tracking-[-0.04em]">Format</h2>
          <p className="mt-3 text-[15.5px] leading-[1.6] text-muted">
            A checkpoint is a short signed note in the common transparency-log style: an origin line, the tree size, the root hash, then one signature line per
            signer. Clients keep the last checkpoint they saw and ask for a consistency proof before trusting a newer one.
          </p>
          <CodePanel title="text/plain · checkpoint" code={FORMAT} className="mt-6" />
          <ul className="mt-8 grid gap-3">
            {[
              "Inclusion proof: shows one receipt is in the tree at a given size.",
              "Consistency proof: shows a newer tree extends an older one without rewriting it.",
              `On-chain anchor: the root is written to ${CHAIN.name} hourly, so the router cannot quietly fork the log.`,
            ].map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-[1.55] text-muted">
                <span className="mt-2.5 size-1.5 shrink-0 bg-signal-deep" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-6">
            <ArrowLink href="/spec/0004-receipts">Receipts spec</ArrowLink>
            <ArrowLink href="/verify">Check a receipt</ArrowLink>
          </div>
        </div>
      </PageBody>
    </>
  );
}
