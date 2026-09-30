import type { Metadata } from "next";
import { ArrowLink, CodePanel, PageBody, PageHero, PreviewTag } from "@/components/ui/page";
import { ProviderList } from "@/components/trust/ProviderList";

export const metadata: Metadata = {
  title: "Providers",
  description: "Who serves your model: bond, canary record and attestation status for every provider.",
};

const INIT = `npx verifyroute-provider init`;
const FULL = `npx verifyroute-provider init --yes --target tdx-gpu \\
  --weights ./my-model --hf-repo <owner/name> --hf-revision <40-hex commit> \\
  --model-image <inference image>@sha256:<digest> --id my-model
npx verifyroute-provider doctor --dir vr-provider --url https://<your endpoint>
npx verifyroute-provider apply  --dir vr-provider --url https://<your endpoint> --submit`;

const STEPS = [
  ["Measure and write", "init hashes your weights (SHA-256 over every file), writes a pinned deployment where every image, the weights and the sidecar are fixed by digest, and creates the key your router account will use. Only the key's hash goes in the configuration."],
  ["Deploy", "Run the pinned deployment on your own confidential virtual machine. The model server gets no route out to the internet."],
  ["Check it", "doctor reads your endpoint the way a client would: health, the shape of /attest, that the served digest matches your weights, and that a reply carries a receipt signed by the attested key."],
  ["Bond and apply", "apply files your application; you post the 10,000 USDG bond on Robinhood Chain. After review and a first canary pass, the provider appears in the list above."],
];

export default function ProvidersPage() {
  return (
    <>
      <PageHero
        eyebrow="Providers / bond and attestation"
        title={
          <>
            Who answers
            <br />
            your call.
          </>
        }
        lede="Every provider with its bond, its canary record, the hardware the router verified and when it last checked. A provider the router has not verified is marked Unverified."
      />
      <PageBody>
        <div className="max-w-[1040px]">
          <section id="list">
            <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">Providers</h2>
            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-muted">
              &ldquo;Attested&rdquo; will mean the router checked a hardware quote from that provider recently. It says what software is running, not what a
              provider does with prompts. Anything not checked is labelled Unverified, and each row will link to its full record.
            </p>
            <div className="mt-8">
              <ProviderList />
            </div>
          </section>

          <section id="run" className="mt-24">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[clamp(30px,3.2vw,40px)] font-[640] tracking-[-0.045em]">Run a provider</h2>
              <PreviewTag>Planned CLI</PreviewTag>
            </div>
            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-muted">
              Serve an open-weights model from confidential hardware you control. One command measures your weights, writes a pinned deployment and makes the
              key your account will use. Nothing is published or paid until you deploy, bond and apply. The tool is in development and not yet published.
            </p>
            <CodePanel title="Terminal · one command, it asks the rest" code={INIT} className="mt-8" />
            <ol className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
              {STEPS.map(([t, b], i) => (
                <li key={t} className="bg-paper p-6">
                  <p className="font-mono text-[11px] text-signal-deep">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-[20px] font-[640] tracking-[-0.03em]">{t}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-muted">{b}</p>
                </li>
              ))}
            </ol>
            <CodePanel title="Terminal · without questions" code={FULL} className="mt-10" />
            <ul className="mt-8 grid gap-3">
              {[
                "The sidecar attests the confidential virtual machine. GPU confidential-computing evidence is a separate check and is reported separately.",
                "doctor does not repeat the hardware vendor's signature check on the quote. The router does, and the verify page says so.",
                "Data-policy fields in an application are the provider's own declaration. They are shown as declared, never as verified.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-[1.55] text-muted">
                  <span className="mt-2.5 size-1.5 shrink-0 bg-warn" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-6">
              <ArrowLink href="/docs">Read the docs</ArrowLink>
              <ArrowLink href="/verify">Verify a provider</ArrowLink>
            </div>
          </section>
        </div>
      </PageBody>
    </>
  );
}
