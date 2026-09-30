import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpecShell } from "@/components/spec/SpecShell";
import { CHANGELOG, DOCS, SPEC_VERSION } from "@/components/spec/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(DOCS), "changelog"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "changelog") return { title: "VEIL changelog" };
  const doc = DOCS[slug];
  return { title: doc ? `VEIL ${doc.number}: ${doc.title}` : "VEIL specification", description: doc?.lede };
}

export default async function SpecDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "changelog") {
    return (
      <SpecShell
        slug="changelog"
        eyebrow={`VEIL specification / changelog · v${SPEC_VERSION}`}
        title="Changelog"
        lede="Every notable change to the VEIL specification. Versions follow semantic versioning; before 1.0.0 any minor version may change the wire format."
        sections={CHANGELOG}
      />
    );
  }
  const doc = DOCS[slug];
  if (!doc) notFound();
  return (
    <SpecShell
      slug={doc.slug}
      eyebrow={`VEIL specification / ${doc.number} · v${SPEC_VERSION}`}
      title={doc.title}
      lede={doc.lede}
      related={doc.related}
      sections={doc.sections}
    />
  );
}
