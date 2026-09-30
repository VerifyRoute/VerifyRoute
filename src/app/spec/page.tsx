import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { SpecShell } from "@/components/spec/SpecShell";
import { SPEC_DOCS, SPEC_VERSION } from "@/components/spec/content";
import { DataTable } from "@/components/docs/Blocks";

export const metadata: Metadata = {
  title: "VEIL specification",
  description: `The open draft specification of VEIL, the ${BRAND.name} privacy protocol.`,
};

export default function SpecOverviewPage() {
  return (
    <SpecShell
      slug="overview"
      eyebrow={`VEIL specification / overview · v${SPEC_VERSION}`}
      title={
        <>
          VEIL, written
          <br />
          down in full.
        </>
      }
      lede={`The protocol behind private lanes on ${BRAND.name}: attestation, transport, blind credits, receipts and measured policy, as an open draft anyone can review or implement.`}
      related={["0001", "0002", "0003", "0004", "0005"]}
      sections={[
        {
          id: "documents",
          title: "Documents",
          body: (
            <>
              <p>The specification is split into five numbered documents and a changelog. Each can be read on its own.</p>
              <ul>
                {SPEC_DOCS.filter((d) => d.slug !== "overview").map((d) => (
                  <li key={d.slug}>
                    <Link href={d.href}>{d.label}</Link>
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          id: "lanes",
          title: "Lanes",
          body: (
            <DataTable
              head={["Lane", "Path", "Payment"]}
              rows={[
                ["standard", "TLS to the router, then to a bonded provider", "Key, USDG balance or per-call"],
                ["attested", "Sealed to an enclave with a fresh quote", "Key, USDG balance, per-call or blind credit"],
                ["blind", "Oblivious relay, then sealed to an enclave", "Blind credits only"],
              ]}
            />
          ),
        },
        {
          id: "targets",
          title: "Guarantees (design targets)",
          body: (
            <ol>
              <li>Every attested answer traces to a published image and weight digest.</li>
              <li>No party outside the enclave reads prompts on attested lanes.</li>
              <li>Blind-lane payments do not link to a wallet.</li>
              <li>Missing or stale evidence refuses a call instead of downgrading it.</li>
              <li>Receipts verify offline with published keys and on-chain anchors.</li>
            </ol>
          ),
        },
        {
          id: "parties",
          title: "Parties",
          body: (
            <DataTable
              head={["Party", "Learns", "Does not learn"]}
              rows={[
                ["Client", "Everything about its own call", "—"],
                ["Relay", "Client address", "Content, model"],
                ["Router", "Model, lane, size, cost", "Sealed content; address on the blind lane"],
                ["Enclave", "Content, in memory", "Who paid, with blind credits"],
              ]}
            />
          ),
        },
        {
          id: "limits",
          title: "Honest limits",
          body: (
            <ul>
              <li>Hardware trust roots and firmware flaws bound every guarantee.</li>
              <li>Traffic analysis can link requests at low volume.</li>
              <li>Attestation shows what code runs, not that it is correct.</li>
            </ul>
          ),
        },
        {
          id: "repo-status",
          title: "Status",
          body: (
            <p>
              Draft {SPEC_VERSION}. Not deployed. Machine-readable status is at <a href="/veil/status.json">/veil/status.json</a>; the design overview is on the{" "}
              <Link href="/veil">VEIL page</Link>.
            </p>
          ),
        },
        {
          id: "license",
          title: "License",
          body: <p>The specification text is offered under the Apache License 2.0 so that anyone may implement it.</p>,
        },
      ]}
    />
  );
}
