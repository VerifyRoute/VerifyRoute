import type { Metadata } from "next";
import { ArrowLink, CodePanel, PageBody, PageHero, PreviewTag } from "@/components/ui/page";
import { ReceiptChecker } from "@/components/trust/ReceiptChecker";
import { PreviewLookup } from "@/components/trust/PreviewLookup";

export const metadata: Metadata = {
  title: "Verify a provider",
  description: "Check what the router verified about a provider, and check a signed receipt in your own browser.",
};

const SDK = `import { VerifyRoute } from "@verifyroute/client";

const vr = new VerifyRoute({ baseUrl: "https://verifyroute.tech", apiKey: process.env.VERIFYROUTE_API_KEY });

// Reads the router's record and the provider's own /attest endpoint, checks
// that the quote binds its TLS key and model digest, and throws
// AttestationRefused before any prompt leaves your machine if a check fails.
const res = await vr.chat.completions.create(
  { model: "<model>", messages: [{ role: "user", content: "Hello" }] },
  { attested: { providerId: "<provider id>", expect: { modelDigest: "sha256:<digest>" } } },
);

console.log(res.verification.receipt.valid);`;

export default function VerifyPage() {
  return (
    <>
      <PageHero
        eyebrow="Verify / providers and receipts"
        title={
          <>
            Don&apos;t take our word.
            <br />
            Check it.
          </>
        }
        lede="What the router has verified about a provider's hardware, what it has not, and a receipt checker that runs in this browser. Anything unverified stays labelled unverified."
      >
        <PreviewLookup
          label="Provider id"
          placeholder="provider id"
          button="Look up"
          empty="no bonded or attested providers are on record yet. Provider records open with the bond stage on the roadmap."
        />
      </PageHero>
      <PageBody>
        <div className="max-w-[1040px]">
          <section id="what-we-saw">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">What the receipt says</h2>
              <PreviewTag />
            </div>
            <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-muted">
              A plain reading of one answer&apos;s receipt: which host could read the prompt, which lane it took, how it was paid, what was kept and what hardware
              answered. Enter the id from the <code className="bg-paper-3 px-1.5 font-mono text-[0.85em]">X-Receipt-Id</code> response header.
            </p>
            <div className="mt-6">
              <PreviewLookup
                label="Receipt id"
                placeholder="gen-…"
                button="Read the receipt"
                empty="the router does not serve receipts yet, so there is nothing to look up. You can still check a receipt's signature below."
              />
            </div>
          </section>

          <section id="check" className="mt-24">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">Check a receipt</h2>
              <span className="chip chip-signal">Works now</span>
            </div>
            <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-muted">
              Paste a receipt as JSON. The payload is put in canonical form (keys sorted, no spaces) and its Ed25519 signature is checked here, with your
              browser&apos;s own cryptography. Nothing you paste leaves this page. Router keys will be published at{" "}
              <code className="bg-paper-3 px-1.5 font-mono text-[0.85em]">/.well-known/verifyroute-keys.json</code> when receipts go live.
            </p>
            <div className="mt-8">
              <ReceiptChecker />
            </div>
          </section>

          <section id="provider" className="mt-24">
            <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">Check the provider yourself</h2>
            <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-muted">
              The router&apos;s record is one account. The planned client SDK goes further before it sends anything: it reads the provider&apos;s own{" "}
              <code className="bg-paper-3 px-1.5 font-mono text-[0.85em]">/attest</code>, confirms the quote commits to its TLS key and model digest, and refuses
              the call if any of that fails.
            </p>
            <CodePanel title="JavaScript · @verifyroute/client (planned)" code={SDK} className="mt-8" />
            <ArrowLink href="/docs#sdk" className="mt-6">
              SDK documentation
            </ArrowLink>
          </section>

          <section id="history" className="mt-24">
            <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">History and badge</h2>
            <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-muted">
              The registry will keep every measurement the router verified for an attested provider, and every check it ran. Each entry gets a badge any site
              can embed; it re-reads the record from the visitor&apos;s browser and shows Attested only when the checks pass.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <ArrowLink href="/registry">Open the registry</ArrowLink>
              <ArrowLink href="/docs#badge">Badge docs</ArrowLink>
            </div>
          </section>
        </div>
      </PageBody>
    </>
  );
}
