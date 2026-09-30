import type { Metadata } from "next";
import { getCatalog } from "@/lib/models";
import { PageBody, PageHero } from "@/components/ui/page";
import { ModelExplorer } from "@/components/playground/ModelExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Models",
  description: "Search the live model catalog, compare list prices and context, and try any model in the console.",
};

export default async function ModelsPage() {
  const catalog = await getCatalog();
  return (
    <>
      <PageHero
        eyebrow="Model explorer / live catalog"
        title="Know your next model."
        lede="Search hundreds of models behind one key, compare what each one costs per million tokens, and open any of them in the console."
      />
      <PageBody>
        {catalog.ok ? (
          <ModelExplorer models={catalog.models} readAt={catalog.readAt} makers={catalog.makers} />
        ) : (
          <div className="border border-line-strong bg-white px-6 py-10 sm:px-10">
            <p className="eyebrow">Catalog unreachable</p>
            <h2 className="h-card mt-4">The live catalog did not answer just now.</h2>
            <p className="mt-3 max-w-[560px] text-[15px] leading-[1.55] text-muted">
              Nothing is shown rather than a stale or made-up list. Reload in a moment and the page reads the catalog again.
            </p>
          </div>
        )}
      </PageBody>
    </>
  );
}
