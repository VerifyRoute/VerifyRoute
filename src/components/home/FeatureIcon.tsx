import { Mark } from "@/components/Logo";

/** Line icons for the feature grid, drawn on a 32px square. */
export function FeatureIcon({ kind, dark = false }: { kind: string; dark?: boolean }) {
  if (kind === "mark") return <Mark size={56} className={dark ? "text-paper" : "text-ink"} />;
  const stroke = dark ? "#f5f5f0" : "#0b0c0b";
  const p = { fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "square" as const };
  const paths: Record<string, React.ReactNode> = {
    code: (
      <>
        <path {...p} d="M11 10 5 16l6 6M21 10l6 6-6 6" />
        <path {...p} d="m18 7-4 18" stroke="#1fe15a" />
      </>
    ),
    coin: (
      <>
        <circle {...p} cx="16" cy="16" r="10" />
        <path {...p} d="M19.5 12.5c-.8-1-2-1.5-3.5-1.5-2 0-3.3 1-3.3 2.4 0 3.4 7 1.8 7 5.3 0 1.4-1.4 2.4-3.6 2.4-1.6 0-3-.6-3.7-1.7M16 8.5v2.5M16 21v2.5" />
      </>
    ),
    receipt: (
      <>
        <path {...p} d="M8 4h16v24l-3-2-2.7 2-2.3-2-2.3 2L11 26l-3 2z" />
        <path {...p} d="M12 11h8M12 15h8M12 19h5" />
        <path {...p} d="m17.5 19.5 1.5 1.5 3-3" stroke="#1fe15a" />
      </>
    ),
    bond: (
      <>
        <path {...p} d="M6 12h20v14H6z" />
        <path {...p} d="M10 12V8a6 6 0 0 1 12 0v4" />
        <path {...p} d="M16 17v4" stroke="#1fe15a" />
      </>
    ),
    canary: (
      <>
        <path {...p} d="M5 22h22M8 22V12M14 22V8M20 22v-6M26 22V14" />
        <circle cx="14" cy="6" r="2" fill="#1fe15a" />
      </>
    ),
    shield: (
      <>
        <path {...p} d="M16 4 7 7.5V15c0 6 4 10 9 12 5-2 9-6 9-12V7.5z" />
        <path {...p} d="m12 16 3 3 5-6" stroke="#1fe15a" />
      </>
    ),
    agent: (
      <>
        <path {...p} d="M8 10h16v12H8zM16 6v4M12 15h.1M20 15h.1M12 26h8" />
        <path {...p} d="M4 14v4M28 14v4" stroke="#1fe15a" />
      </>
    ),
    route: (
      <>
        <path {...p} d="M6 24c6 0 6-16 12-16h8" />
        <path {...p} d="M6 24c6 0 8-6 14-6h6" stroke="#1fe15a" />
        <path {...p} d="M5 23h2v2H5zM25 7h2v2h-2zM25 17h2v2h-2z" />
      </>
    ),
    key: (
      <>
        <circle {...p} cx="11" cy="16" r="5" />
        <path {...p} d="M16 16h11M23 16v4M27 16v3" />
      </>
    ),
    chart: (
      <>
        <path {...p} d="M5 5v22h22" />
        <path {...p} d="m9 21 5-6 4 3 7-9" stroke="#1fe15a" />
      </>
    ),
    team: (
      <>
        <circle {...p} cx="12" cy="11" r="4" />
        <circle {...p} cx="22" cy="12" r="3" />
        <path {...p} d="M4 26c0-4.5 3.5-7 8-7s8 2.5 8 7M20 19c4 0 8 2 8 6" />
      </>
    ),
    log: (
      <>
        <path {...p} d="M7 6h18v20H7z" />
        <path {...p} d="M11 11h10M11 16h10M11 21h6" />
        <circle cx="23" cy="22" r="2" fill="#1fe15a" />
      </>
    ),
  };
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
      {paths[kind] ?? null}
    </svg>
  );
}
