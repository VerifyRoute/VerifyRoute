"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Model } from "@/lib/models";
import { SearchIcon } from "@/components/icons";

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "reasoning", label: "Reasoning", test: (m: Model) => m.reasoning },
  { id: "tools", label: "Tools", test: (m: Model) => m.tools },
  { id: "vision", label: "Vision", test: (m: Model) => m.modalities.includes("image") },
  { id: "files", label: "Files", test: (m: Model) => m.modalities.includes("file") },
  { id: "long", label: "Long context", test: (m: Model) => m.context >= 200_000 },
  { id: "free", label: "Free", test: (m: Model) => m.free },
] as const;

const SORTS = [
  { id: "name", label: "Name" },
  { id: "newest", label: "Newest" },
  { id: "cheapest", label: "Cheapest" },
  { id: "context", label: "Context" },
] as const;

const PAGE = 24;

function money(v: number | null) {
  if (v === null) return "—";
  if (v === 0) return "free";
  return `$${v < 0.01 ? v.toFixed(4) : v.toFixed(2)}`;
}

function ctx(n: number) {
  if (!n) return "—";
  return n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`;
}

function kind(m: Model) {
  if (m.reasoning) return "Reasoning";
  if (m.modalities.includes("image")) return "Vision";
  if (m.tools) return "Tools";
  return "General";
}

export function ModelExplorer({ models, readAt, makers }: { models: Model[]; readAt: string | null; makers: number }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("newest");
  const [shown, setShown] = useState(PAGE);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const test = FILTERS.find((f) => f.id === filter)!.test;
    const out = models.filter((m) => test(m) && (!q || m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.maker.includes(q)));
    out.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "newest") return b.created - a.created;
      if (sort === "cheapest") return (a.input ?? Infinity) - (b.input ?? Infinity);
      return b.context - a.context;
    });
    return out;
  }, [models, query, filter, sort]);

  const time = readAt ? new Date(readAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_170px_150px]">
        <label className="relative block">
          <span className="sr-only">Search models</span>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE);
            }}
            placeholder="Search models or makers…"
            className="field !pl-11"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter models</span>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as typeof filter);
              setShown(PAGE);
            }}
            className="field cursor-pointer"
          >
            {FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Sort models</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="field cursor-pointer">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="max-w-[700px] text-[13.5px] leading-[1.5] text-muted">
          Live catalog · read at {time} · {makers} makers. Prices are list prices per 1M tokens (input / output) from the cheapest listed provider; the router may
          pick another verified provider by uptime and canary record.
        </p>
        <span className="chip w-fit shrink-0 bg-white">
          {list.length} of {models.length} models
        </span>
      </div>

      {list.length === 0 ? (
        <p className="mt-10 border border-line bg-white px-6 py-8 text-[15px] text-muted">No model matches that search. Try a maker name such as “qwen” or “mistral”.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {list.slice(0, shown).map((m) => (
            <article key={m.id} className="flex min-w-0 flex-col border border-line-strong bg-white">
              <div className="flex flex-1 flex-col p-6">
                <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                  <span className="truncate">{m.maker}</span>
                  <i className="size-1.5 bg-signal" />
                  <span>{kind(m)}</span>
                  {m.free ? <span className="chip chip-signal !py-0.5">free</span> : null}
                </p>
                <h3 className="mt-3 truncate text-[22px] font-[620] tracking-[-0.03em]">{m.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-[44px] text-[14.5px] leading-[1.5] text-muted">{m.description || "No description published for this model."}</p>
                <dl className="mt-5 border-t border-line font-mono text-[12px]">
                  <div className="flex justify-between gap-3 border-b border-line py-2.5">
                    <dt>{ctx(m.context)} context</dt>
                    <dd className="text-muted">{m.tools ? "tools" : "text"} route</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-line py-2.5">
                    <dt>{money(m.input)} / 1M input</dt>
                    <dd>{money(m.output)} / 1M output</dd>
                  </div>
                </dl>
                <div className="mt-6 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.08em]">
                  <Link href={`/models/${m.id}`} className="border-b-2 border-signal pb-0.5 hover:text-signal-deep">
                    Model details →
                  </Link>
                  <Link href={`/console?model=${encodeURIComponent(m.id)}`} className="border-b-2 border-signal pb-0.5 hover:text-signal-deep">
                    Try model →
                  </Link>
                </div>
              </div>
              <div className="h-3 bg-ink">
                <div className="h-[3px] translate-y-[9px] bg-[linear-gradient(90deg,transparent,#1fe15a)]" />
              </div>
            </article>
          ))}
        </div>
      )}

      {shown < list.length ? (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn btn-outline-dark">
            Show {Math.min(PAGE, list.length - shown)} more
          </button>
        </div>
      ) : null}
    </div>
  );
}
