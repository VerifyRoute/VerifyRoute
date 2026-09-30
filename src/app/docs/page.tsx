import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN, USDG } from "@/config/brand";
import { ArrowRight } from "@/components/icons";
import { CodePanel, DocShell, Note, PageHero, PreviewTag } from "@/components/ui/page";
import { Callout, DataTable, DocSection } from "@/components/docs/Blocks";

export const metadata: Metadata = {
  title: "API docs",
  description: `How to call ${BRAND.name}: one key, one USDG balance, and a signed receipt on every call.`,
};

const TOC = [
  { id: "quickstart", label: "Quickstart" },
  { id: "routing", label: "Routing" },
  { id: "verify", label: "Verification" },
  { id: "lanes", label: "Lanes" },
  { id: "receipts", label: "Receipts" },
  { id: "keys", label: "Keys" },
  { id: "balance", label: "USDG balance" },
  { id: "payments", label: "Pay per call (402)" },
  { id: "headers", label: "Response headers" },
  { id: "sdk", label: "SDKs" },
  { id: "badge", label: "Badge" },
  { id: "errors", label: "Errors" },
  { id: "endpoints", label: "Endpoint map" },
  { id: "limits", label: "Limits" },
];

const QUICK = `curl https://verifyroute.tech/api/v1/chat/completions \\
  -H "Authorization: Bearer $VERIFYROUTE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta-llama/llama-3.3-70b-instruct",
    "messages": [{ "role": "user", "content": "Name three prime numbers." }]
  }'`;

const NODE = `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://verifyroute.tech/api/v1",
  apiKey: process.env.VERIFYROUTE_API_KEY, // "vr-live-…"
});

const res = await client.chat.completions.create({
  model: "qwen/qwen3-32b",
  messages: [{ role: "user", content: "Summarize this in one line." }],
});

console.log(res.choices[0].message.content);
console.log(res.usage);   // tokens and cost in USDG
console.log(res.receipt); // signed record of the call`;

const ROUTING = `{
  "model": "deepseek/deepseek-r1",
  "messages": [{ "role": "user", "content": "…" }],
  "provider": {
    "order": ["quarry-compute", "tidewater-labs"],
    "sort": "price",
    "allow_fallbacks": true,
    "data_collection": "deny",
    "max_price": { "prompt": 1.0, "completion": 2.0 }
  }
}`;

const VERIFY = `{
  "model": "meta-llama/llama-3.3-70b-instruct",
  "messages": [{ "role": "user", "content": "…" }],
  "verify": {
    "bond_min": 10000,
    "canary_min": 0.99,
    "require_receipt": true
  }
}`;

const RECEIPT = `{
  "id": "rcpt_01J9Q4X2M8",
  "version": 1,
  "generation": "gen-2027114",
  "model": "meta-llama/llama-3.3-70b-instruct",
  "provider": "quarry-compute",
  "lane": "attested",
  "usage": { "prompt_tokens": 142, "completion_tokens": 88 },
  "cost_usdg": "0.00004112",
  "request_sha256": "9f2c…41ab",
  "response_sha256": "0d7e…c3f9",
  "attestation_sha256": "4be0…9d7f",
  "bond": { "amount_usdg": 10000, "status": "active" },
  "canary": { "pass_rate_24h": 1.0 },
  "issued_at": "2026-09-30T09:00:31Z",
  "key_id": "7f21ac03",
  "sig": "ed25519:9Qx4b…Tz0="
}`;

const KEYS = `curl https://verifyroute.tech/api/v1/keys \\
  -H "Authorization: Bearer $VERIFYROUTE_SESSION" \\
  -d '{
    "name": "research-agent",
    "limit": 300,
    "limit_reset": "monthly",
    "allowed_models": ["qwen/qwen3-32b", "deepseek/deepseek-r1"],
    "verify": { "bond_min": 10000 },
    "lane": "standard"
  }'`;

const X402 = `# 1. Call without a key: the router answers with a price.
POST /api/v1/chat/completions            -> 402 Payment Required
{ "amount_usdg": "0.00021", "pay_to": "0x…", "chain_id": ${CHAIN.id}, "expires_in": 120 }

# 2. Pay that amount in USDG from any wallet on ${CHAIN.name}.

# 3. Retry the same request with the proof.
POST /api/v1/chat/completions
X-Payment: <tx hash or signed authorization>  -> 200 OK + receipt`;

const PY = `from openai import OpenAI

client = OpenAI(
    base_url="https://verifyroute.tech/api/v1",
    api_key=os.environ["VERIFYROUTE_API_KEY"],
)

res = client.chat.completions.create(
    model="mistralai/mistral-small",
    messages=[{"role": "user", "content": "Hello"}],
)`;

const BADGE = `<script src="https://verifyroute.tech/badge.js"
        data-endpoint="<provider id or model id>"
        data-theme="light" async></script>

<!-- No scripts allowed? Use the image variant. -->
<img src="https://verifyroute.tech/badge/<provider id>.svg" alt="Verification status" />`;

export default function DocsPage() {
  return (
    <>
      <PageHero
        eyebrow="Developer docs / API v1"
        title={
          <>
            Keep the request.
            <br />
            Gain the proof.
          </>
        }
        lede="Call hundreds of models with one key and one USDG balance, choose how strictly each provider must be verified, and check every receipt yourself."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#quickstart" className="btn btn-cut btn-dot btn-solid-dark">
            Quickstart <ArrowRight className="size-4" />
          </a>
          <a href="/openapi.json" className="btn btn-outline-dark">
            openapi.json <ArrowRight className="size-4" />
          </a>
        </div>
      </PageHero>

      <DocShell toc={TOC}>
        <Note>
          <span className="mb-2 flex flex-wrap items-center gap-2">
            <PreviewTag>API design · preview</PreviewTag>
          </span>
          This page documents the {BRAND.name} API as designed. The live model catalog, wallet sign-in and USDG balance reads work on this site today; keys,
          billing, bonds, canaries and receipts go live in stages (see the <Link href="/#roadmap" className="underline decoration-signal decoration-2 underline-offset-4">roadmap</Link>).
          The base URL will be <code className="bg-paper-3 px-1.5 text-[0.9em]">https://{BRAND.domain}/api/v1</code>.
        </Note>

        <div className="mt-14">
          <DocSection id="quickstart" title="Two lines to switch.">
            <p>
              {BRAND.name} speaks the chat-completions request shape that most AI SDKs already send. Point the client at the {BRAND.name} base URL, use a{" "}
              <code>vr-live-…</code> key, and the rest of your code keeps working: messages, streaming, tools, JSON output and usage fields.
            </p>
            <p>
              Your wallet is your account. Connect it on the dashboard, fund one USDG balance on {CHAIN.name}, and create as many keys as you need. No email and
              no password.
            </p>
          </DocSection>
          <CodePanel title="Example request · curl" code={QUICK} className="mt-6" />
          <CodePanel title="Node · OpenAI SDK" code={NODE} className="mt-5" />

          <DocSection id="routing" title="Tell the router what matters.">
            <p>
              Without preferences, the router sends a call to the healthiest verified provider for that model at the best price. The <code>provider</code>{" "}
              object lets you narrow or reorder that choice:
            </p>
            <ul>
              <li>
                <code>order</code> tries named providers first, in your order.
              </li>
              <li>
                <code>sort</code> ranks the pool by <code>price</code>, <code>latency</code> or <code>throughput</code>.
              </li>
              <li>
                <code>allow_fallbacks</code> lets the next qualifying provider answer if the first one fails.
              </li>
              <li>
                <code>data_collection: &quot;deny&quot;</code> removes providers that declare they keep or train on prompts.
              </li>
              <li>
                <code>max_price</code> caps the USD per million tokens you accept, per direction.
              </li>
            </ul>
          </DocSection>
          <CodePanel title="Routing preferences" code={ROUTING} className="mt-6" />

          <DocSection id="verify" title="Decide how much proof a call needs.">
            <p>
              Verification is the part of routing that most gateways leave out. Every provider on {BRAND.name} is measured on three things, and a request can
              demand a minimum for each:
            </p>
            <ul>
              <li>
                <strong>Bond.</strong> A provider locks 10,000 USDG on {CHAIN.name} before it serves live traffic. A proven failure can be slashed after a
                72-hour dispute window.
              </li>
              <li>
                <strong>Canaries.</strong> Automated test prompts run against every served model around the clock. They check the answers, the weights
                fingerprint, the quantization and the empty-reply rate.
              </li>
              <li>
                <strong>Receipts.</strong> The provider&apos;s answer is only accepted if the router can sign a receipt for it.
              </li>
            </ul>
            <p>
              Set a floor with <code>verify</code> in the body or the <code>X-VR-Verify</code> header. If no provider meets it, the request is refused with a
              clear error instead of being served by a weaker one, and nothing is charged.
            </p>
          </DocSection>
          <CodePanel title="Verified-only request" code={VERIFY} className="mt-6" />

          <DocSection id="lanes" title="Three lanes, one floor each.">
            <p>A lane sets the minimum privacy a request accepts. The router never serves a request below the lane it asked for.</p>
            <DataTable
              head={["Lane", "Who can serve it", "What you get"]}
              rows={[
                ["standard", "Any bonded provider", "TLS to the router and on to the provider, under the provider's declared data policy."],
                ["attested", "Hosts with a fresh TEE quote", "The prompt is only processed inside an enclave whose quote the router verified minutes ago. Quote hash in the receipt."],
                ["blind", "Attested hosts, paid with blind credits", "Payment cannot be tied back to a wallet. Designed in VEIL; not served yet."],
              ]}
            />
            <p>
              Pick a lane with a model suffix (<code>qwen/qwen3-32b:attested</code>), the <code>X-VR-Lane</code> header, or as a default on the key. The full
              privacy design is in <Link href="/veil">VEIL</Link>.
            </p>
          </DocSection>

          <DocSection id="receipts" title="A receipt for every answer.">
            <p>
              Each completed call returns a receipt: which model and provider answered, on which lane, the token counts, the cost in USDG, SHA-256 hashes of the
              request and the response, and the attestation hash when there is one. The router signs it with Ed25519, and every hour it anchors a Merkle root of
              the receipts it issued on {CHAIN.name}.
            </p>
            <p>
              A receipt holds hashes, never text. Anyone holding the original request can confirm it matches; anyone else learns nothing about its content.
              Fetch a receipt later with <code>GET /api/v1/receipts/&#123;id&#125;</code>, and check it in your browser on the <Link href="/verify">verify page</Link>.
            </p>
          </DocSection>
          <CodePanel title="Receipt · example" code={RECEIPT} className="mt-6" />

          <DocSection id="keys" title="One key per workload.">
            <p>
              Keys are created by a connected wallet. Each carries its own policy: a spend limit and reset period, rate limits, an allowlist of models, a minimum
              verification level and a default lane. The key is shown once; the router only stores its hash.
            </p>
          </DocSection>
          <CodePanel title="Create a key" code={KEYS} className="mt-6" />

          <DocSection id="balance" title="One USDG balance.">
            <p>
              Every key draws on the balance of the wallet that owns it. Deposits are USDG on {CHAIN.name} (<code>{USDG.address}</code>, {USDG.decimals}{" "}
              decimals) and are credited once the transfer is final. Prices are quoted per million tokens and charged per call, with no subscription.
            </p>
            <p>Unused balance can be withdrawn back to the same wallet. Your current on-chain USDG shows in the wallet menu as soon as you connect.</p>
          </DocSection>

          <DocSection id="payments" title="Pay per call, no account.">
            <p>
              An agent does not need a key. A request without one receives <code>402 Payment Required</code> with a price in USDG, a pay-to address and an
              expiry. The agent pays from its own wallet and retries with the proof. The receipt then names the payment transaction.
            </p>
          </DocSection>
          <CodePanel title="HTTP 402 flow" code={X402} className="mt-6" />

          <DocSection id="headers" title="What comes back.">
            <DataTable
              head={["Header", "Meaning"]}
              rows={[
                ["X-VR-Receipt-Id", "Id of the signed receipt for this call."],
                ["X-VR-Provider", "Provider that served the call."],
                ["X-VR-Lane", "Lane the call was served on."],
                ["X-VR-Verify", "Checks that passed: bond, canary, attestation."],
                ["X-VR-Cost", "Cost of the call in USDG."],
              ]}
            />
            <p>
              On a stream the same fields arrive in the final event, together with the receipt, so a client never has to make a second request to see what it
              paid.
            </p>
          </DocSection>

          <DocSection id="sdk" title="SDKs you already have.">
            <p>
              Any OpenAI-compatible client works unchanged. A dedicated <code>@verifyroute/client</code> package is in design: it will verify receipts locally and
              refuse to send a request if a provider&apos;s attestation does not check out.
            </p>
          </DocSection>
          <CodePanel title="Python · OpenAI SDK" code={PY} className="mt-6" />

          <DocSection id="badge" title="Show your verification.">
            <p>
              Providers and model builders can embed a badge that reads the public registry from the visitor&apos;s browser. It shows Verified only while the
              checks pass, and falls back to a plain status when they do not.
            </p>
            <Callout label="Planned">The badge script and image are part of the registry stage and are not served yet.</Callout>
          </DocSection>
          <CodePanel title="Badge · HTML" code={BADGE} className="mt-6" />

          <DocSection id="errors" title="Errors that explain themselves.">
            <DataTable
              head={["Status", "Code", "When"]}
              rows={[
                ["400", "invalid_request", "The body is not a valid chat request."],
                ["401", "invalid_key", "Missing, unknown or revoked key."],
                ["402", "payment_required", "No key and no payment proof; the body carries a price."],
                ["402", "insufficient_balance", "The wallet's USDG balance does not cover the call."],
                ["403", "model_not_allowed", "The key's allowlist excludes this model."],
                ["409", "verification_unmet", "No provider meets the requested bond or canary floor."],
                ["429", "rate_limited", "The key's rpm or tpm limit was reached."],
                ["503", "no_attested_endpoint", "The attested lane has no host with a fresh quote right now."],
              ]}
            />
            <p>A refused request is never charged, and it is never quietly sent to a provider below the level you asked for.</p>
          </DocSection>

          <DocSection id="endpoints" title="Endpoint map.">
            <DataTable
              head={["Endpoint", "Purpose"]}
              rows={[
                ["POST /chat/completions", "Chat and completion calls, streaming or not."],
                ["GET /models", "Catalog with prices, context and supported features."],
                ["POST /keys", "Create a key with its policy."],
                ["GET /keys", "List keys for the connected wallet."],
                ["GET /receipts/{id}", "Fetch a signed receipt."],
                ["GET /providers/{id}", "Bond, canary and attestation record for a provider."],
                ["GET /.well-known/vr-receipt-keys.json", "Public keys used to sign receipts."],
              ]}
            />
            <p>
              The machine-readable description is at <a href="/openapi.json">/openapi.json</a>.
            </p>
          </DocSection>

          <DocSection id="limits" title="Limits and honest caveats.">
            <ul>
              <li>An attestation shows what code is running in an enclave. It does not prove what a provider does outside it.</li>
              <li>Canaries catch swapped or degraded models statistically; they are evidence, not a guarantee for each single call.</li>
              <li>A bond limits what a provider can lose, not what a user can lose. Disputes are decided on recorded evidence.</li>
              <li>Receipts prove what the router saw and signed. Their anchors on {CHAIN.name} prove when.</li>
            </ul>
            <p>
              Questions or corrections: <a href={BRAND.x}>{BRAND.xHandle}</a> on X.
            </p>
          </DocSection>
        </div>
      </DocShell>
    </>
  );
}
