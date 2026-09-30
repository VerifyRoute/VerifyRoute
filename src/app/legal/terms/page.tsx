import type { Metadata } from "next";
import { BRAND, CHAIN, DESIGN } from "@/config/brand";
import { LegalPage } from "@/components/trust/LegalPage";

export const metadata: Metadata = {
  title: "Service notes",
  description: `How routing, settlement, bonds and receipts are meant to work on ${BRAND.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal / service notes"
      title="Service notes"
      lede="How routing, settlement, provider bonds and receipts are meant to work on this router."
      current="terms"
      sections={[
        {
          h: "Launch status",
          body: (
            <p>
              {BRAND.name} is a public preview. It does not accept deposits, hold funds or take payments of any kind. Nothing on this site is an offer of a paid
              service yet; binding terms will be published before payments are enabled.
            </p>
          ),
        },
        {
          h: "Routing and settlement",
          body: (
            <p>
              {BRAND.name} will route AI requests to third-party model providers and settle usage in USDG on {CHAIN.name}. Model output always comes from the
              provider that served the call; the router does not write or edit answers. Fees will be stated per call in the receipt before any call is billed.
            </p>
          ),
        },
        {
          h: "Provider bonds and disputes",
          body: (
            <p>
              Providers are designed to post a bond of {DESIGN.bondUsdg.toLocaleString("en-US")} USDG before serving live traffic. Evidence from canary checks
              can lead to a slash proposal, which opens a {DESIGN.disputeHours}-hour dispute window before any penalty or refund. These are protocol design
              values and may change before contracts are deployed.
            </p>
          ),
        },
        {
          h: "Receipts and on-chain actions",
          body: (
            <p>
              Receipts are signed statements about a call; they prove what the router recorded, not that a model&apos;s answer is correct. Transactions on{" "}
              {CHAIN.name} are final once confirmed. Nothing on this site is investment advice, and the {BRAND.symbol} token is not a claim on fees or revenue.
            </p>
          ),
        },
        {
          h: "References",
          body: (
            <p>
              Mentions of {CHAIN.name}, model makers, wallets and other services describe compatibility and the network used. They do not imply endorsement or
              partnership.
            </p>
          ),
        },
      ]}
      closing="The operator of this router must publish binding legal and commercial terms before offering the service publicly."
      cta={["/", `Back to ${BRAND.name}`]}
    />
  );
}
