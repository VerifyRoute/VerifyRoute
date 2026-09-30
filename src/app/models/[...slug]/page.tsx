import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatContext, formatPrice, getCatalog } from "@/lib/models";
import { ArrowLink, CodePanel, PageBody, PageHero, PreviewTag } from "@/components/ui/page";
import { ArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string[] }> };

async function find(slug: string[]) {
  const id = slug.map(decodeURIComponent).join("/");
  const catalog = await getCatalog();
  return { catalog, model: catalog.models.find((m) => m.id === id) ?? null, id };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { model, id } = await find(slug);
  return { title: model ? model.name : id, description: model?.description.slice(0, 160) || "Model details from the live catalog." };
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const { catalog, model } = await find(slug);
  if (!catalog.ok) {
    return (
      <>
        <PageHero eyebrow="Model / live catalog" title="Catalog unreachable." lede="The live catalog did not answer, so this model cannot be shown right now. Reload in a moment." />
        <PageBody>
          <ArrowLink href="/models">Back to all models</ArrowLink>
        </PageBody>
      </>
    );
  }
  if (!model) notFound();

  const facts: [string, string][] = [
    ["Model id", model.id],
    ["Maker", model.maker],
    ["Context window", `${formatContext(model.context)} tokens`],
    ["Input price", `${formatPrice(model.input)} / 1M tokens`],
    ["Output price", `${formatPrice(model.output)} / 1M tokens`],
    ["Input types", model.modalities.join(", ")],
    ["Output types", model.outputs.join(", ")],
    ["Tool calling", model.tools ? "supported" : "not listed"],
    ["Reasoning", model.reasoning ? "supported" : "not listed"],
    ["Listed", model.created ? new Date(model.created * 1000).toISOString().slice(0, 10) : "—"],
  ];

  const code = `const answer = await client.chat.completions.create({
  model: "${model.id}",
  messages: [{ role: "user", content: "Hello" }],
});

answer.receipt; // signed by the router once receipts ship`;

  return (
    <>
      <PageHero
        eyebrow={`Model / ${model.maker}`}
        title={model.name}
        lede={model.description ? <span className="line-clamp-5">{model.description}</span> : "The maker has not published a description for this model."}
      >
        <div className="flex flex-wrap gap-3">
          <Link href={`/console?model=${encodeURIComponent(model.id)}`} className="btn btn-cut btn-dot btn-solid-dark">
            Try in the console <ArrowRight className="size-4" />
          </Link>
          <Link href={`/arena?models=${encodeURIComponent(model.id)}`} className="btn btn-outline-dark">
            Race it in the arena <ArrowRight className="size-4" />
          </Link>
        </div>
      </PageHero>
      <PageBody>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="eyebrow">Know · from the live catalog</p>
            <dl className="mt-6 border-t border-line-strong">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)] gap-4 border-b border-line py-3 sm:grid-cols-[160px_minmax(0,1fr)]">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{k}</dt>
                  <dd className="break-words font-mono text-[13px]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">Verify · per provider</p>
              <PreviewTag />
            </div>
            <div className="mt-6 border border-line-strong bg-white">
              {[
                ["Provider bond", "10,000 USDG required before live traffic"],
                ["Quality canaries", "Weights fingerprint, exact-answer set, empty-reply rate"],
                ["Signed receipt", "Ed25519 over model, provider, tokens, cost and hashes"],
                ["TEE attestation", "Required on the attested lane only"],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-line px-5 py-4 last:border-0">
                  <p className="text-[15px] font-medium">{k}</p>
                  <p className="mt-1 text-[14px] text-muted">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[13px] leading-[1.5] text-muted">
              No provider is bonded yet. These checks show what each call to this model will carry once bonded providers go live.
            </p>
          </div>
        </div>
        <div className="mt-14">
          <CodePanel title="Route · node" code={code} />
        </div>
        <div className="mt-10">
          <ArrowLink href="/models">Back to all models</ArrowLink>
        </div>
      </PageBody>
    </>
  );
}
