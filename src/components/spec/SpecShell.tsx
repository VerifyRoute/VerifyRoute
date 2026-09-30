import Link from "next/link";
import { PageBody, PageHero } from "@/components/ui/page";
import { MetaTable } from "@/components/docs/Blocks";
import { SPEC_DOCS, SPEC_VERSION, SPEC_UPDATED } from "@/components/spec/content";

export type SpecSection = { id: string; title: string; body: React.ReactNode };

/** Shared layout for the VEIL specification: document list, page outline, metadata and numbered sections. */
export function SpecShell({
  slug,
  eyebrow,
  title,
  lede,
  related,
  sections,
  status = "Draft",
}: {
  slug: string;
  eyebrow: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  related?: string[];
  sections: SpecSection[];
  status?: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={lede} />
      <PageBody>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header)+32px)] max-h-[calc(100vh-var(--header)-48px)] overflow-y-auto border-l border-line">
              <p className="mono-label pl-4 text-muted">Documents</p>
              <ul className="mt-4 grid gap-1">
                {SPEC_DOCS.map((d) => {
                  const on = d.slug === slug;
                  return (
                    <li key={d.slug}>
                      <Link
                        href={d.href}
                        aria-current={on ? "page" : undefined}
                        className={`-ml-px block border-l py-1.5 pl-4 text-[14px] leading-[1.35] transition-colors ${
                          on ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink"
                        }`}
                      >
                        {d.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="mono-label mt-8 pl-4 text-muted">On this page</p>
              <ul className="mt-4 grid gap-2.5 pb-4 pl-4">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-[13.5px] leading-[1.35] text-muted hover:text-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 max-w-[780px]">
            {/* Phone: the document list as a scrolling row. */}
            <nav aria-label="Spec documents" className="scroll-x no-scrollbar -mx-4 mb-8 flex gap-2 px-4 lg:hidden">
              {SPEC_DOCS.map((d) => (
                <Link
                  key={d.slug}
                  href={d.href}
                  className={`chip shrink-0 ${d.slug === slug ? "chip-solid" : ""}`}
                >
                  {d.short}
                </Link>
              ))}
            </nav>

            <div className="border border-line border-l-[3px] border-l-signal-deep bg-white/70 px-5 py-4 text-[15px] leading-[1.6]">
              The VEIL specification is an open draft published so anyone can review or implement it. Nothing described here is deployed by the router yet unless a
              section says otherwise.
            </div>
            <div className="mt-6">
              <MetaTable
                rows={[
                  ["Status", status],
                  ["Version", SPEC_VERSION],
                  ["Updated", SPEC_UPDATED],
                  ["License", "Apache-2.0 (specification text)"],
                  ...(related && related.length
                    ? ([
                        [
                          "Related",
                          <span key="r" className="flex flex-wrap gap-x-2">
                            {related.map((r, i) => {
                              const doc = SPEC_DOCS.find((d) => d.slug.startsWith(r));
                              return (
                                <span key={r}>
                                  <Link href={doc?.href ?? "/spec"} className="underline decoration-signal decoration-2 underline-offset-4">
                                    {r}
                                  </Link>
                                  {i < related.length - 1 ? "," : ""}
                                </span>
                              );
                            })}
                          </span>,
                        ],
                      ] as [string, React.ReactNode][])
                    : []),
                ]}
              />
            </div>

            <div className="mt-4">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-[calc(var(--header)+24px)] pt-14">
                  <h2 className="text-[clamp(24px,2.6vw,32px)] font-[640] leading-[1.08] tracking-[-0.035em]">{s.title}</h2>
                  <div className="prose-vr mt-4">{s.body}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
