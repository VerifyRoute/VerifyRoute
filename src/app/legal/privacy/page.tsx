import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";
import { LegalPage } from "@/components/trust/LegalPage";

export const metadata: Metadata = {
  title: "Data notice",
  description: `What ${BRAND.name} stores, where prompts go and how to sign out of this browser.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal / data notice"
      title="Data notice"
      lede="What this site stores, where your prompts go, and how to remove your session from this browser."
      current="privacy"
      sections={[
        {
          h: "Preview status and contact",
          body: (
            <p>
              {BRAND.name} is in public preview. The router does not yet route paid calls, and this site accepts no deposits or payments. Retention periods, a
              support address and the process for deletion requests will be published before paid routing opens. Until then, reach the team on X at{" "}
              <a href={BRAND.x} target="_blank" rel="noreferrer">
                {BRAND.xHandle}
              </a>
              .
            </p>
          ),
        },
        {
          h: "What the router will store",
          body: (
            <p>
              Only what it needs to route and account for calls: API key hashes (never the keys), balances and ledger entries, receipts with token counts, costs
              and SHA-256 hashes of each request and reply, and the wallet addresses you sign in or pay from. The accounting database has no place for prompt or
              reply text. The full list, and what this site keeps today, is on <Link href="/retention">What we keep</Link>.
            </p>
          ),
        },
        {
          h: "Where your prompts go",
          body: (
            <p>
              A prompt goes to the provider that serves the call, under that provider&apos;s data policy, which is shown per provider. Attested requests only go
              to hosts with a fresh TEE attestation. Deposits, bonds and receipt anchors are public on {CHAIN.name}. On the console, arena and file pages of this
              site, prompts are passed through this server to the model provider in memory and are not stored here.
            </p>
          ),
        },
        {
          h: "Your controls",
          body: (
            <p>
              Signing in is connecting a wallet. The session is kept in this browser&apos;s localStorage; choose Disconnect in the account menu to remove it.
              Keys and files you enter on tool pages stay in the tab&apos;s memory and are gone on reload.
            </p>
          ),
        },
      ]}
      closing="The operator of this router will publish its legal entity, retention periods and a full privacy policy before offering paid routing to the public."
      cta={["/dashboard", "Open the workspace"]}
    />
  );
}
