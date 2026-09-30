import Link from "next/link";
import type { SpecSection } from "@/components/spec/SpecShell";

/* The VEIL specification documents. Written for Verify Route; every section
   is a draft design unless it says otherwise. */

export const SPEC_VERSION = "0.1.0";
export const SPEC_UPDATED = "2026-09-30";

export const SPEC_DOCS = [
  { slug: "overview", href: "/spec", label: "Overview", short: "Overview" },
  { slug: "0001-attestation", href: "/spec/0001-attestation", label: "0001 Attestation", short: "0001" },
  { slug: "0002-transport", href: "/spec/0002-transport", label: "0002 Transport", short: "0002" },
  { slug: "0003-credits", href: "/spec/0003-credits", label: "0003 Blind credits", short: "0003" },
  { slug: "0004-receipts", href: "/spec/0004-receipts", label: "0004 Receipts and verification", short: "0004" },
  { slug: "0005-policy", href: "/spec/0005-policy", label: "0005 Measured policy", short: "0005" },
  { slug: "changelog", href: "/spec/changelog", label: "Changelog", short: "Changelog" },
] as const;

export type SpecDoc = {
  slug: string;
  number: string | null;
  title: string;
  lede: string;
  related: string[];
  sections: SpecSection[];
};

const conventions: SpecSection = {
  id: "conventions",
  title: "1. Conventions and terms",
  body: (
    <>
      <p>
        The words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are used as in RFC 2119 and RFC 8174 when written in capitals. Terms used across the documents:
      </p>
      <ul>
        <li>
          <strong>Router</strong>: the Verify Route service that routes, prices and signs calls.
        </li>
        <li>
          <strong>Enclave</strong>: a confidential VM, optionally with a confidential GPU, running the sidecar and a model server.
        </li>
        <li>
          <strong>Sidecar</strong>: the process in the enclave that measures weights, holds keys and signs node receipts.
        </li>
        <li>
          <strong>Quote</strong>: hardware-signed evidence of what was measured into the enclave.
        </li>
        <li>
          <strong>Lane</strong>: the privacy floor of a request, one of <code>standard</code>, <code>attested</code> or <code>blind</code>.
        </li>
      </ul>
    </>
  ),
};

const statusSection = (what: string): SpecSection => ({
  id: "status",
  title: "Status of this document",
  body: (
    <p>
      This is a working draft of VEIL and not a standards-track document. It describes {what} as designed for Verify Route. None of it is deployed yet; when a
      part ships, this section will say which, and the changelog will record it.
    </p>
  ),
});

export const DOCS: Record<string, SpecDoc> = {
  "0001-attestation": {
    slug: "0001-attestation",
    number: "0001",
    title: "Attestation",
    lede: "How an enclave proves which image, which weights and which keys are serving a request, and how the router and clients check that proof.",
    related: ["0002", "0004", "0005"],
    sections: [
      statusSection("the evidence an enclave publishes and how it is verified"),
      {
        id: "abstract",
        title: "Abstract",
        body: (
          <p>
            A VEIL enclave runs the sidecar in front of an OpenAI-compatible model server. At boot the sidecar measures the model weights, generates its keys
            inside the enclave and requests a hardware quote whose report data commits to those keys and measurements. The router verifies that quote before it
            sends any attested request, and publishes what it verified.
          </p>
        ),
      },
      conventions,
      {
        id: "evidence",
        title: "2. The evidence document",
        body: (
          <>
            <p>
              An enclave MUST serve <code>GET /attest</code> returning a JSON evidence document with these fields:
            </p>
            <ul>
              <li>
                <code>quote</code>: the raw hardware quote, base64.
              </li>
              <li>
                <code>bindings</code>: the TLS public key hash, the receipt public key, the model digest and the image digest.
              </li>
              <li>
                <code>nonce</code>: echoed from the verifier&apos;s request to prove freshness.
              </li>
            </ul>
            <p>
              The quote&apos;s report data MUST equal <code>SHA-256(canonical_json(bindings)) || nonce</code>. A verifier that recomputes this and finds a
              mismatch MUST reject the enclave.
            </p>
          </>
        ),
      },
      {
        id: "measurement",
        title: "3. Measuring the weights",
        body: (
          <p>
            The model digest is a SHA-256 over the sorted list of weight files and their own SHA-256 values. The sidecar MUST compute it before the model server
            loads, and MUST refuse to start if it does not match the digest in the enclave&apos;s manifest. The manifest itself is part of the measured image.
          </p>
        ),
      },
      {
        id: "keys",
        title: "4. Keys",
        body: (
          <p>
            The TLS key and the receipt-signing key (Ed25519) are generated inside the enclave and MUST NOT be exported. Rotating either key requires a new quote.
            The certificate served to clients SHOULD carry a name derived from the quote so that a client can bind the TLS session to the evidence.
          </p>
        ),
      },
      {
        id: "freshness",
        title: "5. Freshness and revocation",
        body: (
          <p>
            The router re-verifies each attested host at least every ten minutes with a new nonce. A host whose last good verification is older than the
            freshness window MUST be removed from the <code>attested</code> and <code>blind</code> lanes until it verifies again. A known-vulnerable hardware or
            firmware status MUST be treated as a failed verification.
          </p>
        ),
      },
      {
        id: "registry",
        title: "6. Public record",
        body: (
          <p>
            Every measurement the router accepts is appended to a public registry with the time it was first and last seen. A change of image or weights shows
            up as a new version. The registry is designed to be anchored alongside receipts (see <Link href="/spec/0004-receipts">0004</Link>).
          </p>
        ),
      },
      {
        id: "security",
        title: "7. Security considerations",
        body: (
          <ul>
            <li>Attestation proves what runs, not that it is free of bugs.</li>
            <li>Trust rests on the hardware vendor&apos;s root keys and on the correctness of the confidential computing design.</li>
            <li>GPU confidential computing evidence is collected separately from the CPU quote and MUST be verified on its own.</li>
          </ul>
        ),
      },
    ],
  },
  "0002-transport": {
    slug: "0002-transport",
    number: "0002",
    title: "Transport",
    lede: "How a request travels sealed to the enclave, how the blind lane hides the client's address, and how a lane is chosen and enforced.",
    related: ["0001", "0003"],
    sections: [
      statusSection("request encryption, the relay and lane selection"),
      {
        id: "abstract",
        title: "Abstract",
        body: (
          <p>
            Attested requests are encrypted end to end to the enclave with HPKE, so the router forwards ciphertext. Blind-lane requests also pass an oblivious
            HTTP relay run by a party independent of the router.
          </p>
        ),
      },
      conventions,
      {
        id: "sealing",
        title: "2. Sealing the body",
        body: (
          <>
            <p>
              The client fetches the enclave&apos;s HPKE public key from its verified evidence and seals the request body with HPKE (RFC 9180,
              DHKEM(X25519), HKDF-SHA256, AES-128-GCM). The outer request keeps only what routing needs: model, lane and an upper bound on size.
            </p>
            <p>The enclave answers with a framed response sealed to a key derived from the same HPKE context, so the router cannot read the answer either.</p>
          </>
        ),
      },
      {
        id: "relay",
        title: "3. The oblivious relay",
        body: (
          <p>
            On the <code>blind</code> lane the client sends an Oblivious HTTP message (RFC 9458) to a relay. The relay forwards it to the router&apos;s gateway
            without the client&apos;s address; the gateway cannot see who sent it, and the relay cannot read it. The relay operator MUST be independent of the
            router operator for the property to hold.
          </p>
        ),
      },
      {
        id: "lanes",
        title: "4. Choosing a lane",
        body: (
          <>
            <p>
              A lane is set by the <code>X-VR-Lane</code> header, a model suffix, or the key&apos;s default, and the strictest of them applies. The router MUST
              refuse a request it cannot serve at the requested lane with one of:
            </p>
            <ul>
              <li>
                <code>no_attested_endpoint</code>: no host has a fresh quote for this model.
              </li>
              <li>
                <code>lane_requires_blind_payment</code>: a key or wallet was presented on the blind lane.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "security",
        title: "5. Security considerations",
        body: (
          <ul>
            <li>Message size and timing can link blind-lane requests; clients SHOULD pad and MAY add delay.</li>
            <li>A relay and router run by the same party provide no network separation.</li>
          </ul>
        ),
      },
    ],
  },
  "0003-credits": {
    slug: "0003-credits",
    number: "0003",
    title: "Blind credits",
    lede: "Credits bought with USDG and signed blindly, so that spending one proves payment without revealing which wallet paid.",
    related: ["0002", "0004"],
    sections: [
      statusSection("how blind credits are issued, held and spent"),
      {
        id: "abstract",
        title: "Abstract",
        body: (
          <p>
            A wallet pays USDG on Robinhood Chain and receives credits signed with blind RSA (RFC 9474). The router never sees the credit it signs, so a spent
            credit cannot be matched to its purchase.
          </p>
        ),
      },
      conventions,
      {
        id: "issuance",
        title: "2. Issuance",
        body: (
          <p>
            A one-time key created in the client receives the USDG payment. The client blinds a batch of random credit values, the router signs the blinded
            values against the paid amount, and the client unblinds them. Credits come in fixed denominations so that value does not become an identifier.
          </p>
        ),
      },
      {
        id: "spending",
        title: "3. Spending",
        body: (
          <p>
            A credit is presented as <code>Authorization: BlindCredit token=&lt;token&gt;</code> on the blind lane. The router checks the signature and a
            spent-set, records the credit&apos;s hash, and serves the call up to the credit&apos;s value. The unused part of a credit is not refunded.
          </p>
        ),
      },
      {
        id: "linkability",
        title: "4. What stays linkable",
        body: (
          <ul>
            <li>The USDG purchase is public on-chain: that a wallet bought credits, and how many.</li>
            <li>Buying and spending close together in time can link them; clients SHOULD wait.</li>
            <li>Which prompts a credit paid for is not linkable to the purchase.</li>
          </ul>
        ),
      },
      {
        id: "expiry",
        title: "5. Expiry and keys",
        body: (
          <p>
            Each signing key has a published validity window; credits signed with it expire with it. Keys are listed at a well-known URL and rotated on a fixed
            schedule so that a key change cannot be used to tag a single buyer.
          </p>
        ),
      },
    ],
  },
  "0004-receipts": {
    slug: "0004-receipts",
    number: "0004",
    title: "Receipts and verification",
    lede: "What a receipt contains, who signs it, how receipts are anchored on Robinhood Chain and how anyone can check one offline.",
    related: ["0001", "0005"],
    sections: [
      statusSection("the receipt format, signatures and anchoring"),
      {
        id: "abstract",
        title: "Abstract",
        body: (
          <p>
            Every call yields a router receipt signed with Ed25519, and on attested lanes also a node receipt signed by the enclave. Receipts carry hashes and
            counts, never text. Hourly Merkle roots of all receipts are anchored on Robinhood Chain.
          </p>
        ),
      },
      conventions,
      {
        id: "claims",
        title: "2. Receipt claims",
        body: (
          <ul>
            <li>
              <code>generation</code>, <code>model</code>, <code>provider</code>, <code>lane</code>
            </li>
            <li>
              <code>usage</code> (prompt and completion tokens) and <code>cost_usdg</code>
            </li>
            <li>
              <code>request_sha256</code> and <code>response_sha256</code> over the exact bytes exchanged
            </li>
            <li>
              <code>attestation_sha256</code> on attested lanes, <code>bond</code> and <code>canary</code> status at routing time
            </li>
            <li>
              <code>issued_at</code>, <code>key_id</code> and <code>sig</code>
            </li>
          </ul>
        ),
      },
      {
        id: "signing",
        title: "3. Signing",
        body: (
          <p>
            The signature covers the canonical JSON of all other claims (keys sorted, no whitespace). Public keys are published at{" "}
            <code>/.well-known/vr-receipt-keys.json</code> with their validity windows. For streamed answers, each chunk extends a hash chain and the final
            receipt signs the head of that chain.
          </p>
        ),
      },
      {
        id: "anchoring",
        title: "4. Anchoring",
        body: (
          <p>
            Once an hour the router builds a Merkle tree of the receipts it issued and writes the root to a contract on Robinhood Chain. A receipt can then be
            shown with its Merkle path, proving it existed at that hour and has not changed.
          </p>
        ),
      },
      {
        id: "verification",
        title: "5. Verification",
        body: (
          <ol>
            <li>Canonicalize the claims and check the Ed25519 signature against the published key for its window.</li>
            <li>If you hold the request, hash it and compare with request_sha256.</li>
            <li>If a Merkle path is present, recompute the root and compare it with the anchored value on-chain.</li>
            <li>On attested lanes, compare attestation_sha256 with the registry entry for that host.</li>
          </ol>
        ),
      },
      {
        id: "privacy",
        title: "6. Privacy considerations",
        body: (
          <p>
            A hash does not reveal text, but anyone holding an exact guess of a request can confirm it. Receipts are therefore only returned to the caller, and
            the anchored roots reveal nothing about individual calls.
          </p>
        ),
      },
    ],
  },
  "0005-policy": {
    slug: "0005-policy",
    number: "0005",
    title: "Measured policy",
    lede: "How any content filtering in an enclave is made inspectable: part of the measured image, versioned, and recorded in the receipt.",
    related: ["0001", "0004"],
    sections: [
      statusSection("how content policy is measured, applied and recorded"),
      {
        id: "abstract",
        title: "Abstract",
        body: (
          <p>
            An enclave MAY apply a content policy. If it does, the policy is part of the measured image, its rules are published, and each refusal is recorded in
            the receipt with the policy version. A private lane never hides a filter from the user.
          </p>
        ),
      },
      conventions,
      {
        id: "definition",
        title: "2. Policy definition",
        body: (
          <p>
            A policy is a <code>policy.json</code> file naming the categories it acts on, the action for each (refuse or annotate) and the classifier model and
            digest. Its SHA-256 is included in the enclave bindings (see <Link href="/spec/0001-attestation">0001</Link>).
          </p>
        ),
      },
      {
        id: "outcomes",
        title: "3. Outcomes",
        body: (
          <p>
            A refused request returns <code>policy_refused</code> with the category and the policy digest, and is not charged beyond the classification cost. The
            receipt records the outcome, so a refusal is as checkable as an answer.
          </p>
        ),
      },
      {
        id: "stats",
        title: "4. Aggregate statistics",
        body: (
          <p>
            The enclave MAY publish counts of outcomes per category with added noise and a per-request contribution bound, so that operators can report on policy
            use without exposing any single request.
          </p>
        ),
      },
    ],
  },
};

export const CHANGELOG: SpecSection[] = [
  {
    id: "unreleased",
    title: "[Unreleased]",
    body: (
      <>
        <h3>Planned</h3>
        <ul>
          <li>0001: GPU confidential computing evidence as a separate verified claim.</li>
          <li>0004: streamed receipt hash chain carried in server-sent event comments.</li>
          <li>0005: noisy aggregate statistics with a fixed privacy budget.</li>
        </ul>
      </>
    ),
  },
  {
    id: "v010",
    title: `${SPEC_VERSION} - ${SPEC_UPDATED}`,
    body: (
      <>
        <p>First public draft.</p>
        <h3>Added</h3>
        <ul>
          <li>Overview: the four questions, lanes standard, attested and blind, design targets and who learns what.</li>
          <li>0001 Attestation: evidence document, weight measurement, in-enclave keys, freshness rules.</li>
          <li>0002 Transport: HPKE sealing to the enclave, oblivious relay, lane selection and refusals.</li>
          <li>0003 Blind credits: issuance against USDG, spending, linkability, expiry.</li>
          <li>0004 Receipts: claims, Ed25519 signing, hourly anchoring on Robinhood Chain, offline verification.</li>
          <li>0005 Measured policy: policy file, outcomes in receipts, aggregate statistics.</li>
        </ul>
      </>
    ),
  },
];
