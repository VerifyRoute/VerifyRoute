import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { CopyText } from "@/components/ui/CopyText";

/* Shared building blocks for inner pages: the hero with its progress rule,
   the "On this page" layout, section heads and code panels. */

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
  wide = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="pb-12 pt-16 sm:pt-[116px]">
      <div className={`mx-auto w-full px-4 sm:px-6 ${wide ? "max-w-[1280px] lg:px-10" : "max-w-[1088px] lg:px-6"}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h-page mt-6 max-w-[900px]">{title}</h1>
        {lede ? <div className="lede mt-7 max-w-[600px] text-muted">{lede}</div> : null}
        {children ? <div className="mt-8">{children}</div> : null}
        <Rule className="mt-12" />
      </div>
    </section>
  );
}

export function Rule({ className = "", max = "max-w-[820px]" }: { className?: string; max?: string }) {
  return (
    <div className={`relative h-px bg-line ${max} ${className}`}>
      <span className="absolute left-0 top-[-0.5px] h-[2px] w-[72px] bg-signal-deep" />
    </div>
  );
}

export function PageBody({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto w-full px-4 pb-28 sm:px-6 ${wide ? "max-w-[1280px] lg:px-10" : "max-w-[1088px] lg:px-6"}`}>{children}</div>
  );
}

/** Two-column documentation layout with a sticky "On this page" list. */
export function DocShell({ toc, children }: { toc: { id: string; label: string }[]; children: React.ReactNode }) {
  return (
    <PageBody>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-[calc(var(--header)+32px)] border-l border-line pl-4">
            <p className="mono-label text-muted">On this page</p>
            <ul className="mt-4 grid gap-3">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-[14px] leading-[1.35] text-muted transition-colors hover:text-ink">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="min-w-0 max-w-[780px]">{children}</div>
      </div>
    </PageBody>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  dark = false,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  dark?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className={`eyebrow ${dark ? "on-dark" : ""}`}>{eyebrow}</p>
        <h2 className="h-section mt-6">{title}</h2>
      </div>
      {lede ? <p className={`lede max-w-[540px] ${dark ? "text-muted-dark" : "text-muted"}`}>{lede}</p> : null}
    </div>
  );
}

export function CodePanel({
  title,
  code,
  children,
  className = "",
}: {
  title: string;
  /** Plain text for the copy button. */
  code: string;
  /** Optional highlighted rendering; falls back to the plain text. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`corner-cut min-w-0 bg-ink-2 text-paper ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line-dark px-4 py-3 sm:px-5">
        <span className="flex min-w-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-dark">
          <span className="flex gap-1" aria-hidden="true">
            <i className="size-1.5 bg-ink-4" />
            <i className="size-1.5 bg-ink-4" />
            <i className="size-1.5 bg-ink-4" />
          </span>
          <span className="truncate">{title}</span>
        </span>
        <CopyText text={code} className="text-paper" />
      </div>
      <pre className="code px-4 py-5 sm:px-6">{children ?? code}</pre>
    </div>
  );
}

export function Note({ children, tone = "signal" }: { children: React.ReactNode; tone?: "signal" | "warn" }) {
  return (
    <div className={`border border-line bg-white/70 px-5 py-4 text-[15px] leading-[1.55] ${tone === "warn" ? "border-l-[3px] border-l-warn" : "border-l-[3px] border-l-signal-deep"}`}>
      {children}
    </div>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.06em] underline decoration-signal decoration-2 underline-offset-[6px] hover:text-signal-deep ${className}`}>
      {children} <ArrowRight className="size-3.5" />
    </Link>
  );
}

/** "Preview" marker used wherever something is designed but not live yet. */
export function PreviewTag({ children = "Preview · not live" }: { children?: React.ReactNode }) {
  return <span className="chip chip-warn">{children}</span>;
}

export function LiveTag({ children = "Live" }: { children?: React.ReactNode }) {
  return (
    <span className="chip chip-signal">
      <i className="size-1.5 animate-pulse-dot bg-signal-deep" /> {children}
    </span>
  );
}
