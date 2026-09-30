import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";
import { ArrowRight } from "@/components/icons";
import { DocShell, PageHero, PreviewTag } from "@/components/ui/page";
import { Callout, DataTable, DocSection } from "@/components/docs/Blocks";

export const metadata: Metadata = {
  title: "VEIL privacy protocol",
  description: `VEIL is the ${BRAND.name} design for private inference on open models: attested serving, encrypted relay, blind credits and a ledger of receipts.`,
};

const TOC = [
  { id: "questions", label: "Four questions" },
  { id: "request", label: "One request" },
  { id: "sidecar", label: "V · Sidecar" },
  { id: "relay", label: "E · Relay" },
  { id: "credits", label: "I · Credits" },
  { id: "ledger", label: "L · Ledger" },
  { id: "policy", label: "Measured policy" },
  { id: "parties", label: "Who learns what" },
  { id: "limits", label: "Honest limits" },
  { id: "targets", label: "Design targets" },
  { id: "status", label: "Status" },
  { id: "point", label: "Why it matters" },
];

const QUESTIONS = [
  "Which model and which software produced this answer?",
  "Who was able to read the prompt while it was being processed?",
  "Can the payment be separated from the request it paid for?",
  "Can the result be checked without revealing the request?",
];

const LANES = [
  { name: "standard", path: "TLS to the router, then to any bonded provider", who: "Any bonded provider", pay: "Key, USDG balance or per-call payment" },
  { name: "attested", path: "TLS to the router, then to an enclave whose quote the router verified minutes ago", who: "Attested hosts only", pay: "Key, USDG balance, per-call payment or blind credit" },
  { name: "blind", path: "Oblivious relay run by an independent party, then to an attested enclave", who: "Attested hosts only", pay: "Blind credits only; keys and wallets are refused" },
];

const STEPS = [
  {
    n: "01",
    t: "Served inside an enclave.",
    b: "The request reaches a confidential VM, optionally with a confidential GPU. The sidecar in front of the model server hashed the weights at boot, generated its keys in memory and asked the hardware for a quote that commits to those keys and hashes. A client can compare that quote to the published measurements.",
  },
  {
    n: "02",
    t: "Encrypted to the enclave.",
    b: "The prompt is sealed to the enclave's key before it leaves the client. The router can still route and bill the call, but it forwards ciphertext it cannot read. On the blind lane an independent relay also hides the client's network address from the router.",
  },
  {
    n: "03",
    t: "Paid without a name.",
    b: "Blind credits are bought with USDG and signed blindly by the router. When one is spent, the router can tell it is genuine and unspent, but not which wallet or purchase it came from.",
  },
  {
    n: "04",
    t: "A receipt to check.",
    b: "The enclave and the router each sign a receipt holding hashes of the request and the response, the model digest and the attestation hash. Hourly roots are anchored on Robinhood Chain, so the record cannot be rewritten later.",
  },
];

export default function VeilPage() {
  return (
    <>
      <PageHero
        eyebrow="VEIL / privacy protocol · draft v0.1.0"
        title={
          <>
            Private inference
            <br />
            you can verify.
          </>
        }
        lede={`VEIL is the privacy layer of ${BRAND.name}: an open protocol for serving open-weight models so that four plain questions get answers backed by evidence rather than by promises.`}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/spec" className="btn btn-cut btn-dot btn-solid-dark">
            Read the spec <ArrowRight className="size-4" />
          </Link>
          <a href="/veil/status.json" className="btn btn-outline-dark">
            status.json <ArrowRight className="size-4" />
          </a>
        </div>
      </PageHero>

      <DocShell toc={TOC}>
        <section id="questions" className="scroll-mt-[calc(var(--header)+24px)]">
          <h2 className="text-[clamp(28px,3vw,40px)] font-[640] leading-[1.02] tracking-[-0.04em]">Four questions.</h2>
          <ol className="mt-6 border-t border-line">
            {QUESTIONS.map((q, i) => (
              <li key={q} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-b border-line py-5 sm:grid-cols-[64px_minmax(0,1fr)]">
                <span className="pt-1 font-mono text-[12px] text-signal-deep">Q{i + 1}</span>
                <span className="text-[clamp(19px,1.8vw,23px)] font-[560] leading-[1.25] tracking-[-0.02em]">{q}</span>
              </li>
            ))}
          </ol>
          <div className="prose-vr mt-6">
            <p>
              The name spells the four parts: <strong>V</strong>erified sidecar, <strong>E</strong>ncrypted relay, <strong>I</strong>ndependent (blind) credits and
              a <strong>L</strong>edger of receipts. A fifth part, measured policy, describes any filtering in a form a verifier can inspect. The aim is not to
              ask anyone to accept a privacy statement. It is to give builders a way to check one.
            </p>
            <h3>Why open models need this</h3>
            <p>
              Open weights mean choice: the same model can run at many hosts, in many regions. That choice also spreads a prompt across systems run by different
              people. A prompt can hold unreleased code, research, trading logic or customer records, and the usual arrangement asks you to trust each host with
              it while it is in use. VEIL replaces that trust with evidence you can check before you send anything.
            </p>
          </div>
        </section>

        <DocSection id="request" title="The design in one request.">
          <p>A VEIL request is a chain of steps that can each be checked on their own. It starts with the client choosing the privacy floor it needs:</p>
        </DocSection>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {LANES.map((l) => (
            <div key={l.name} className="border border-line-strong bg-white/70 p-5">
              <p className="mono-label text-muted">Lane</p>
              <p className="mt-1 font-mono text-[20px] font-semibold">{l.name}</p>
              <p className="mono-label mt-4 text-muted">Path</p>
              <p className="mt-1 text-[14.5px] leading-[1.45]">{l.path}</p>
              <p className="mono-label mt-4 text-muted">Who can serve it</p>
              <p className="mt-1 text-[14.5px] leading-[1.45]">{l.who}</p>
              <p className="mono-label mt-4 text-muted">Payment</p>
              <p className="mt-1 text-[14.5px] leading-[1.45]">{l.pay}</p>
            </div>
          ))}
        </div>
        <div className="prose-vr mt-6">
          <p>
            A lane is a floor, not a wish. When the router cannot meet it, the request is refused with the reason, rather than being served below the level the
            client asked for.
          </p>
        </div>
        <ol className="relative mt-10 border-l border-signal-deep/40 pl-8">
          {STEPS.map((s) => (
            <li key={s.n} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[38px] top-1 size-[11px] rotate-45 border border-signal-deep bg-signal/80" />
              <p className="font-mono text-[12px] text-signal-deep">{s.n} /</p>
              <h3 className="mt-2 text-[22px] font-[640] tracking-[-0.03em]">{s.t}</h3>
              <p className="mt-3 text-[16px] leading-[1.65] text-muted">{s.b}</p>
            </li>
          ))}
        </ol>

        <DocSection id="sidecar" title={<><span className="text-signal-deep">V</span> · A verified sidecar.</>}>
          <p>
            The sidecar sits in front of an OpenAI-compatible model server inside the enclave. At boot it hashes every weight file, checks the digest against the
            allowed list, generates a TLS key and a receipt-signing key in memory, and binds all of them into the hardware quote.
          </p>
          <ul>
            <li>The quote proves which image and which weights are running, and that the keys never left the enclave.</li>
            <li>The router re-checks each host&apos;s quote on a short interval. A stale quote removes the host from attested lanes.</li>
            <li>Every change of image or weights produces a new measurement, recorded in the public registry.</li>
          </ul>
          <p>
            Details: <Link href="/spec/0001-attestation">0001 Attestation</Link>.
          </p>
        </DocSection>

        <DocSection id="relay" title={<><span className="text-signal-deep">E</span> · An encrypted relay.</>}>
          <p>
            Clients encrypt the request body to the enclave&apos;s public key with HPKE. The router sees the routing fields it needs (model, lane, size) and
            forwards the sealed body. On the blind lane, the request first passes an oblivious HTTP relay operated by a party independent of the router, so the
            router never learns the client&apos;s IP address, and the relay never learns the content.
          </p>
          <p>
            Details: <Link href="/spec/0002-transport">0002 Transport</Link>.
          </p>
        </DocSection>

        <DocSection id="credits" title={<><span className="text-signal-deep">I</span> · Independent, blind credits.</>}>
          <p>
            A wallet buys credits with USDG. The router signs each credit blindly, so the signature is valid but the router never sees the value it signed.
            Spending a credit proves it is genuine and unspent without revealing where it came from. The purchase itself is public on {CHAIN.name}; which prompts
            the credits paid for is not.
          </p>
          <p>
            Details: <Link href="/spec/0003-credits">0003 Credits</Link> and the <Link href="/credits">blind credits</Link> page.
          </p>
        </DocSection>

        <DocSection id="ledger" title={<><span className="text-signal-deep">L</span> · A ledger of receipts.</>}>
          <p>
            Two signatures cover each answer: the enclave signs what it computed, and the router signs what it routed and charged. Both receipts hold hashes,
            never text. The router batches receipts into an hourly Merkle tree and anchors the root on {CHAIN.name}, so a receipt can later be proven to have
            existed at that time and not changed since.
          </p>
          <p>
            Details: <Link href="/spec/0004-receipts">0004 Receipts</Link>.
          </p>
        </DocSection>

        <DocSection id="policy" title="Measured policy, not hidden filters.">
          <p>
            If an enclave applies any content policy, that policy is part of its measured image. Its rules are published, the outcome of a refusal is recorded in
            the receipt, and a verifier can see which policy version was in force. Filtering that cannot be inspected has no place in a private lane.
          </p>
          <p>
            Details: <Link href="/spec/0005-policy">0005 Measured policy</Link>.
          </p>
        </DocSection>

        <DocSection id="parties" title="Who learns what.">
          <DataTable
            head={["Party", "Learns", "Does not learn"]}
            rows={[
              ["Relay", "Client network address, message sizes", "Prompt, answer, which model"],
              ["Router", "Model, lane, size, cost, credit validity", "Prompt and answer (sealed), client address on the blind lane"],
              ["Enclave host", "That a request arrived", "Anything inside the enclave, if the hardware holds"],
              ["Enclave", "Prompt and answer, in memory only", "Who paid, when blind credits are used"],
              ["Chain", "Hourly receipt roots, USDG purchases", "Individual prompts or which credit paid for them"],
            ]}
          />
        </DocSection>

        <DocSection id="limits" title="Honest limits.">
          <ul>
            <li>Confidential computing depends on the hardware vendor&apos;s design and keys. A flaw there weakens every attested lane.</li>
            <li>An attestation says what code runs. It does not say that the code is free of bugs.</li>
            <li>Timing and size can still link requests on the blind lane, especially at low traffic.</li>
            <li>The text of a request is read inside the enclave; privacy covers who else can read it, not the model itself.</li>
          </ul>
        </DocSection>

        <DocSection id="targets" title="Design targets.">
          <DataTable
            head={["Target", "Meaning"]}
            rows={[
              ["T1 · Measured serving", "Every attested answer is traceable to a published image and weight digest."],
              ["T2 · Sealed content", "No party outside the enclave can read prompts on attested lanes."],
              ["T3 · Unlinked payment", "Blind-lane payments cannot be tied to a wallet."],
              ["T4 · Fail closed", "Missing or stale evidence refuses the call; it never downgrades it."],
              ["T5 · Checkable record", "Receipts verify offline with published keys and on-chain anchors."],
            ]}
          />
        </DocSection>

        <DocSection id="status" title="What exists, and what is planned.">
          <Callout label="Status">
            <span className="mb-2 flex">
              <PreviewTag>Draft · not deployed</PreviewTag>
            </span>
            VEIL is a public draft. No attested lane, relay or blind credit is served by {BRAND.name} today. The specification is published so that it can be
            reviewed before it is built, and every part will be marked here when it goes live. Machine-readable status:{" "}
            <a href="/veil/status.json" className="underline decoration-signal decoration-2 underline-offset-4">
              /veil/status.json
            </a>
            .
          </Callout>
        </DocSection>

        <DocSection id="point" title="Open models should not mean open prompts.">
          <p>
            A public specification lets any host implement the same guarantees and lets any client check them the same way. That is the point of VEIL: privacy
            that is a property of the system you can verify, not a line in someone&apos;s terms.
          </p>
          <p>
            <Link href="/spec">Read the specification →</Link>
          </p>
        </DocSection>
      </DocShell>
    </>
  );
}
