"use client";

import { useState } from "react";

/* A key's policy as switches. Flipping one rewrites the JSON beside it,
   so the example shows exactly what a key would carry. Illustrative only. */

type Opt = { id: string; label: string; hint: string; on: boolean };

const START: Opt[] = [
  { id: "fallbacks", label: "Fallbacks", hint: "routing.provider", on: true },
  { id: "budget", label: "Budget cap", hint: "limit · reset", on: true },
  { id: "rate", label: "Rate limits", hint: "rpm · tpm", on: true },
  { id: "allow", label: "Model allowlist", hint: "allowed_models", on: true },
  { id: "verified", label: "Verified only", hint: "bond · canary", on: false },
  { id: "private", label: "Attested lane", hint: "tee required", on: false },
  { id: "team", label: "Team scope", hint: "roles · budgets", on: false },
  { id: "expiry", label: "Expiry", hint: "expires_at", on: false },
];

export function KeyPolicy() {
  const [opts, setOpts] = useState(START);
  const on = (id: string) => opts.find((o) => o.id === id)?.on ?? false;
  const count = opts.filter((o) => o.on).length;

  const lines: [string, string, string][] = [
    ["name", '"research-agent"', "s"],
    ["limit", on("budget") ? "300" : "null", on("budget") ? "n" : "b"],
    ["limit_reset", on("budget") ? '"monthly"' : "null", on("budget") ? "s" : "b"],
    ["rpm", on("rate") ? "600" : "null", on("rate") ? "n" : "b"],
    ["tpm", on("rate") ? "400000" : "null", on("rate") ? "n" : "b"],
    ["allowed_models", on("allow") ? '["qwen/qwen3-32b", "deepseek/deepseek-r1"]' : "null", on("allow") ? "s" : "b"],
    ["verify", on("verified") ? '{ "bond_min": 10000, "canary_min": 0.99 }' : "null", on("verified") ? "s" : "b"],
    ["lane", on("private") ? '"attested"' : '"standard"', "s"],
    ["team", on("team") ? '"research"' : "null", on("team") ? "s" : "b"],
    ["expires_at", on("expiry") ? '"2026-12-31"' : "null", on("expiry") ? "s" : "b"],
  ];

  return (
    <div className="corner-cut min-w-0 border border-line-strong bg-white">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        <span>POST /api/v1/keys · example</span>
        <span className="text-ink">
          {count} / {opts.length} on
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {opts.map((o, i) => (
          <button
            key={o.id}
            type="button"
            role="switch"
            aria-checked={o.on}
            onClick={() => setOpts((list) => list.map((x) => (x.id === o.id ? { ...x, on: !x.on } : x)))}
            className={`flex items-center justify-between gap-3 border-line px-4 py-3.5 text-left transition-colors hover:bg-paper ${i % 2 === 0 ? "sm:border-r" : ""} border-b`}
          >
            <span>
              <span className="block text-[15px] font-medium">{o.label}</span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{o.hint}</span>
            </span>
            <span className={`relative h-5 w-9 shrink-0 border ${o.on ? "border-ink bg-ink" : "border-line-strong/40 bg-paper-2"}`}>
              <span className={`absolute top-[2px] size-[14px] transition-all ${o.on ? "left-[18px] bg-signal" : "left-[2px] bg-white shadow"}`} />
            </span>
          </button>
        ))}
      </div>
      <pre className="code bg-ink-2 px-4 py-5 text-[12px] sm:px-5">
        {"{\n"}
        {lines.map(([k, v, kind], i) => (
          <span key={k}>
            {"  "}
            <span className="tok-s">&quot;{k}&quot;</span>: <span className={`tok-${kind}`}>{v}</span>
            {i < lines.length - 1 ? ",\n" : "\n"}
          </span>
        ))}
        {"}"}
      </pre>
    </div>
  );
}
