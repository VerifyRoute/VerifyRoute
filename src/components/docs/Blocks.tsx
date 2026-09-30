/* Small building blocks shared by the docs, VEIL and spec pages. */

export function DocSection({ id, title, children }: { id: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[calc(var(--header)+24px)] pt-16 first:pt-0">
      <h2 className="text-[clamp(28px,3vw,40px)] font-[640] leading-[1.02] tracking-[-0.04em] text-ink">{title}</h2>
      <div className="prose-vr mt-5">{children}</div>
    </section>
  );
}

/** Simple two-or-more column table that stays inside its column on phones. */
export function DataTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="scroll-x my-5 border border-line bg-white/70">
      <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border-b border-line-strong px-4 py-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              {r.map((c, j) => (
                <td key={j} className={`border-b border-line px-4 py-3 last:pr-4 ${j === 0 ? "font-mono text-[12.5px] text-ink" : "text-[#2b2f2a]"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Label / value grid used for spec metadata. */
export function MetaTable({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="border border-line bg-white/70 text-[15px]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-1 gap-1 border-b border-line px-4 py-3.5 last:border-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] sm:gap-4">
          <dt className="font-medium text-ink">{k}</dt>
          <dd className="text-[#2b2f2a]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Callout with a small mono heading, for quoted rules and status notes. */
export function Callout({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 border border-line border-l-[3px] border-l-signal-deep bg-white/70 px-5 py-4 text-[15px] leading-[1.6]">
      {label ? <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{label}</p> : null}
      {children}
    </div>
  );
}
