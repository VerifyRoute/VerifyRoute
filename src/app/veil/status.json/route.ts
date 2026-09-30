import { NextResponse } from "next/server";
import { BRAND } from "@/config/brand";
import { SPEC_DOCS, SPEC_UPDATED, SPEC_VERSION } from "@/components/spec/content";

export const dynamic = "force-static";

/** Machine-readable status of the VEIL specification. Nothing here is deployed yet. */
export function GET() {
  return NextResponse.json({
    object: "veil.status",
    project: BRAND.name,
    spec: {
      version: SPEC_VERSION,
      updated: SPEC_UPDATED,
      status: "draft, not deployed",
      license: "Apache-2.0",
      documents: SPEC_DOCS.map((d) => ({
        number: /^\d{4}/.test(d.slug) ? d.slug.slice(0, 4) : null,
        title: d.label,
        url: d.href,
      })),
    },
    components: {
      verified_sidecar: "designed",
      encrypted_relay: "designed",
      blind_credits: "designed",
      receipt_ledger: "designed",
      measured_policy: "designed",
    },
    lanes: {
      standard: "planned",
      attested: "planned",
      blind: "planned",
    },
  });
}
