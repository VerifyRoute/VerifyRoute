import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";
import { ArrowRight } from "@/components/icons";
import { CodePanel, Note, PageBody, PageHero } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Case study: an audited research agent",
  description: "An illustrative workflow: a research agent whose every call arrives with evidence its operator can check.",
};

const REQUEST = `{
  "endpoint": "POST /api/v1/chat/completions",
  "headers": {
    "Authorization": "Bearer <VERIFYROUTE_API_KEY>",
    "X-VR-Lane": "attested"
  },
  "body": {
    "model": "author/model",
    "messages": [
      { "role": "user", "content": "Your prompt" }
    ],
    "verify": { "bond_min": 10000, "canary_min": 0.99 }
  }
}`;

const STEPS = [
  {
    t: "Set the policy.",
    b: "The operator creates a key for the agent with a verified-only policy: providers must hold a 10,000 USDG bond on Robinhood Chain and a canary pass rate of at least 99% over the last day. The key also carries a monthly USDG cap and a model allowlist, so the agent cannot drift to anything else.",
  },
  {
    t: "Route the request.",
    b: "The agent keeps its usual request: model and messages. A lane header asks for the attested lane, and the verify block restates the policy. Providers that fail any condition are filtered out before the call is priced.",
    code: true,
  },
  {
    t: "Check before answering.",
    b: "The router confirms the provider's bond is posted, its latest canary set passed and its enclave quote is fresh. If the attested host's evidence is stale, the call fails closed instead of quietly moving to a weaker lane, and the agent gets a clear refusal.",
  },
  {
    t: "Keep the evidence.",
    b: `The reply comes back with a signed receipt: model, provider, lane, token counts, USDG cost, hashes of the request and reply, and the hash of the attestation quote. The receipt root is anchored on ${CHAIN.name}. The operator pastes the receipt into the checker and verifies the signature in a browser, without asking anyone.`,
  },
];

export default function CaseStudyPage() {
  return (
    <>
      <PageHero
        eyebrow="Case study / illustrative workflow"
        title={
          <>
            One agent.
            <br />
            Every call on the record.
          </>
        }
        lede="How a research agent runs on models its operator did not pick by hand, while every answer arrives with evidence the operator can check."
      >
        <Note tone="warn">
          An illustrative walkthrough of how {BRAND.name} is designed to work. It is not a customer result, not a record of a live transaction, and not investment
          advice.
        </Note>
      </PageHero>
      <PageBody>
        <div className="max-w-[820px]">
          <section>
            <h2 className="text-[clamp(28px,3vw,38px)] font-[640] tracking-[-0.04em]">The starting point</h2>
            <p className="mt-4 text-[16.5px] leading-[1.65] text-muted">
              A team runs a research agent that answers questions for clients. The clients ask a fair question: which model wrote this, on whose hardware, and
              did anyone else see the prompt? The team wants to answer with evidence, not a policy page, without rewriting the agent.
            </p>
          </section>

          <ol className="relative mt-14 border-l border-line pl-8 sm:pl-12">
            <span className="absolute -left-px top-0 h-[70%] w-[2px] bg-signal-deep" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative pb-14 last:pb-0">
                <span className="absolute -left-[38px] top-1 size-3 rotate-45 border border-signal-deep bg-signal sm:-left-[54px]" aria-hidden="true" />
                <p className="font-mono text-[12px] text-signal-deep">{String(i + 1).padStart(2, "0")} /</p>
                <h2 className="mt-2 text-[clamp(28px,3vw,38px)] font-[640] tracking-[-0.045em]">{s.t}</h2>
                <p className="mt-4 text-[16.5px] leading-[1.65] text-[#2b2f2a]">{s.b}</p>
                {s.code ? <CodePanel title="Verified-only request" code={REQUEST} className="mt-8" /> : null}
              </li>
            ))}
          </ol>

          <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["Operator control", "Cap. Restrict. Revoke.", "A spending limit, a provider policy and a key that can be switched off at once."],
              ["Checkable result", "Follow the receipt.", "Model, provider, cost, attestation and anchor in one signed record."],
            ].map(([k, t, b]) => (
              <div key={k} className="corner-tab border border-line bg-white p-6">
                <p className="mono-label text-muted">{k}</p>
                <h3 className="mt-3 text-[24px] font-[640] tracking-[-0.035em]">{t}</h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-muted">{b}</p>
              </div>
            ))}
          </div>

          <section className="mt-20 border-t border-line pt-10">
            <h2 className="text-[clamp(28px,3vw,38px)] font-[640] tracking-[-0.04em]">Try it</h2>
            <p className="mt-4 text-[16.5px] leading-[1.65] text-muted">
              Two parts work today: connect a wallet to open the workspace and see your {CHAIN.name} balances, and check a signed sample receipt in your browser.
              Keys, bonded providers and attested lanes follow the roadmap.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/verify" className="btn btn-cut btn-dot btn-solid-dark">
                Check a receipt <ArrowRight className="size-4" />
              </Link>
              <Link href="/dashboard" className="btn btn-outline-dark">
                Open the workspace <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </PageBody>
    </>
  );
}
