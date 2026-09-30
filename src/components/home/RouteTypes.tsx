"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "@/components/icons";
import { CopyText } from "@/components/ui/CopyText";

const TYPES = [
  {
    title: "Open inference",
    tag: "Routing",
    points: ["Model preferences", "Sort by price or speed", "USDG"],
    code: [
      ["k", "const "], ["", "res = "], ["k", "await "], ["", "vr.chat.completions.create({\n  model: "], ["s", '"meta-llama/llama-3.3-70b-instruct"'], ["", ",\n  messages,\n  provider: { sort: "], ["s", '"price"'], ["", ", allow_fallbacks: "], ["b", "true"], ["", " },\n});\n\nres.route.provider;     "], ["c", "// who answered"], ["", "\nres.usage.cost;         "], ["c", "// what it cost, in USDG"], ["", "\nres.receipt.sig;        "], ["c", "// Ed25519 over the whole call"],
    ],
  },
  {
    title: "Attested private lane",
    tag: "Privacy",
    points: ["TEE evidence", "Fails closed", "Hash in receipt"],
    code: [
      ["k", "const "], ["", "res = "], ["k", "await "], ["", "vr.chat.completions.create({\n  model: "], ["s", '"qwen/qwen3-32b:attested"'], ["", ",\n  messages,\n});\n\nres.route.lane;         "], ["c", '// "attested"'], ["", "\nres.route.tee;          "], ["c", "// tdx + gpu cc quote"], ["", "\nres.receipt.attestation;"], ["c", " // sha256 of the quote"],
    ],
  },
  {
    title: "Verified-only routing",
    tag: "Verification",
    points: ["Bonded providers", "Canary pass rate", "Receipt required"],
    code: [
      ["k", "const "], ["", "res = "], ["k", "await "], ["", "vr.chat.completions.create({\n  model: "], ["s", '"deepseek/deepseek-r1"'], ["", ",\n  messages,\n  verify: { bond_min: "], ["n", "10000"], ["", ", canary_min: "], ["n", "0.99"], ["", " },\n});\n\nres.route.bond;         "], ["c", "// 10,000 USDG posted"], ["", "\nres.route.canary;       "], ["c", "// last 24h pass rate"],
    ],
  },
  {
    title: "Agent pay-per-call",
    tag: "Payments",
    points: ["HTTP 402 quote", "Pay from a wallet", "Retry with proof"],
    code: [
      ["c", "// No key yet: the router answers with a quote."], ["", "\n"], ["k", "const "], ["", "quote = "], ["k", "await "], ["", "fetch(url, { method: "], ["s", '"POST"'], ["", ", body });\n"], ["c", "// 402 · amount in USDG · pay-to address"], ["", "\n\n"], ["k", "const "], ["", "paid = "], ["k", "await "], ["", "fetch(url, {\n  headers: { "], ["s", '"X-Payment"'], ["", ": proof },\n  method: "], ["s", '"POST"'], ["", ", body,\n});"],
    ],
  },
] as const;

export function RouteTypes() {
  const [active, setActive] = useState(0);
  const t = TYPES[active];
  const plain = t.code.map(([, text]) => text).join("");
  return (
    <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <div>
        <ul className="border-t border-line-strong">
          {TYPES.map((type, i) => {
            const on = i === active;
            return (
              <li key={type.title} className={`border-b ${on ? "border-signal" : "border-line"}`}>
                <button type="button" onClick={() => setActive(i)} aria-pressed={on} className="flex w-full items-start gap-4 py-5 text-left sm:py-6">
                  <span className="pt-1.5 font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[clamp(22px,2.2vw,30px)] font-[640] leading-[1.05] tracking-[-0.04em] transition-opacity ${on ? "" : "opacity-80"}`}>
                      {type.title}
                    </span>
                    {on ? (
                      <span className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted">
                        {type.points.map((p) => (
                          <span key={p}>
                            <span className="text-signal-deep">+</span> {p}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <span className={`chip ${on ? "chip-solid" : ""}`}>{type.tag}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <Link href="/models" className="btn btn-outline-dark mt-8">
          Explore models <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="corner-cut flex min-w-0 flex-col bg-ink-2 text-paper">
        <div className="flex items-center justify-between border-b border-line-dark px-5 py-3.5">
          <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-dark">
            <span className="flex gap-1" aria-hidden="true">
              <i className="size-1.5 bg-ink-4" />
              <i className="size-1.5 bg-ink-4" />
              <i className="size-1.5 bg-ink-4" />
            </span>
            chat/completions
          </span>
          <CopyText text={plain} className="text-paper" />
        </div>
        <pre key={active} className="code min-h-[290px] animate-fade px-5 py-6 sm:px-6">
          {t.code.map(([kind, text], i) => (
            <span key={i} className={kind ? `tok-${kind}` : undefined}>
              {text}
            </span>
          ))}
          <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-blink bg-signal" />
        </pre>
        <div className="mt-auto grid grid-cols-1 border-t border-line-dark sm:grid-cols-3">
          {[
            ["01", "Know", "catalog, price, provider"],
            ["02", "Verify", "bond, canary, attestation"],
            ["03", "Route", "served, signed, anchored"],
          ].map(([n, k, v], i) => (
            <div key={n} className={`px-5 py-4 font-mono text-[11px] ${i ? "border-t border-line-dark sm:border-l sm:border-t-0" : ""}`}>
              <p className="uppercase tracking-[0.08em]">
                <span className="text-signal">{n}</span> {k}
              </p>
              <p className="mt-1.5 text-muted-dark">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
