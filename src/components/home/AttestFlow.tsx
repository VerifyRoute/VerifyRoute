"use client";

import { useEffect, useState } from "react";
import { ShieldIcon } from "@/components/icons";

/* A private request walking through its checks one row at a time.
   Example values only; the panel is labelled as an example. */

const STEPS = ["Request :attested", "Quote verified", "Route selected", "Receipt signed"];
const ROWS: [string, string][] = [
  ["request", "llama-3.3-70b:attested"],
  ["tee", "intel tdx + gpu confidential compute"],
  ["nonce", "0x81c4…2e9a · bound to session"],
  ["quote", "sha256:4be0c1…9d7f02"],
  ["freshness", "verified 3 min ago"],
  ["data policy", "training no · retention none"],
  ["receipt", "attestation sha256:4be0c1…9d7f02"],
];

export function AttestFlow() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((v) => (v + 1) % (ROWS.length + 5)), 700);
    return () => window.clearInterval(t);
  }, []);
  const shown = Math.min(tick, ROWS.length);
  const done = tick >= ROWS.length;
  const stepOn = (i: number) => shown >= [1, 4, 6, 7][i];

  return (
    <div className="min-w-0 border border-line-strong bg-white">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em]">
        <span>Private lane · example</span>
        <span className="text-muted">fail-closed</span>
      </div>
      <div className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s} className={`border-line px-3 py-3 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} sm:border-l sm:first:border-l-0`}>
            <span className={`block size-2.5 border ${stepOn(i) ? "border-signal-deep bg-signal" : "border-ink"}`} />
            <p className="mt-2.5 font-mono text-[10.5px] uppercase leading-[1.35] tracking-[0.06em]">{s}</p>
          </div>
        ))}
      </div>
      <div className="relative px-4 py-4 sm:px-5">
        <ShieldIcon className={`absolute right-5 top-5 hidden size-12 transition-colors sm:block ${done ? "text-signal-deep" : "text-ink/70"}`} />
        <dl className="grid gap-1.5 font-mono text-[12px]">
          {ROWS.map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
              <dt className="uppercase tracking-[0.06em] text-muted/70">{k}</dt>
              <dd className={`truncate ${i < shown ? "text-ink" : "text-muted/60"}`}>{i < shown ? v : "pending"}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={`border-t border-line px-4 py-3.5 font-mono text-[12px] uppercase tracking-[0.06em] ${done ? "bg-signal-tint text-signal-deep" : ""}`}>
        {done ? "✓ Attestation verified · lane allowed" : "Verifying attestation…"}
      </div>
    </div>
  );
}
