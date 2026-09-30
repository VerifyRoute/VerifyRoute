import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { PageBody, PageHero } from "@/components/ui/page";

/** Shared frame for the two legal pages: hero, a tab switch, sections, closing note. */
export function LegalPage({
  eyebrow,
  title,
  lede,
  current,
  sections,
  closing,
  cta,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  current: "privacy" | "terms";
  sections: { h: string; body: React.ReactNode }[];
  closing: string;
  cta: [string, string];
}) {
  const tabs = [
    ["privacy", "/legal/privacy", "Data notice"],
    ["terms", "/legal/terms", "Service notes"],
  ] as const;
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={lede} />
      <PageBody>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14">
          <aside>
            <p className="mono-label text-muted">Legal</p>
            <ul className="mt-4 flex gap-5 lg:grid lg:gap-3">
              {tabs.map(([id, href, label]) => (
                <li key={id}>
                  <Link href={href} className={`text-[14.5px] ${current === id ? "font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4" : "text-muted hover:text-ink"}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="min-w-0 max-w-[760px]">
            <div className="prose-vr">
              {sections.map((s) => (
                <section key={s.h}>
                  <h2>{s.h}</h2>
                  {s.body}
                </section>
              ))}
            </div>
            <div className="mt-14 border border-line border-l-[3px] border-l-warn bg-white px-5 py-4 text-[15px] leading-[1.55]">{closing}</div>
            <Link href={cta[0]} className="btn btn-outline-dark mt-8">
              {cta[1]} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </PageBody>
    </>
  );
}
