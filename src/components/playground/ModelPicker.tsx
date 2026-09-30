"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Model } from "@/lib/models";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";

export function priceLine(m: Model) {
  const f = (v: number | null) => (v === null ? "—" : v === 0 ? "free" : `$${v < 1 ? v.toFixed(2) : v.toFixed(2)}`);
  const ctx = m.context >= 1_000_000 ? `${+(m.context / 1_000_000).toFixed(1)}M` : `${Math.round(m.context / 1000)}K`;
  return `${m.maker} · ${ctx} · ${f(m.input)} / ${f(m.output)}`;
}

/**
 * Searchable model menu. `tone` follows the surface it sits on.
 * The list renders at most 80 matches so a 400-model catalog stays quick.
 */
export function ModelPicker({
  models,
  value,
  onChange,
  tone = "light",
  placeholder = "Choose a model",
  label,
  loading = false,
}: {
  models: Model[];
  value: string;
  onChange: (id: string) => void;
  tone?: "light" | "dark";
  placeholder?: string;
  label?: string;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const current = models.find((m) => m.id === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? models.filter((m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)) : models;
    return list.slice(0, 80);
  }, [models, query]);

  const dark = tone === "dark";
  return (
    <div ref={root} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 border px-3.5 py-2.5 text-left ${
          dark ? "border-line-dark-strong bg-ink-3 text-paper" : "border-line-strong bg-white text-ink"
        }`}
      >
        <span className="min-w-0">
          {label ? <span className={`block font-mono text-[10px] uppercase tracking-[0.08em] ${dark ? "text-muted-dark" : "text-muted"}`}>{label}</span> : null}
          <span className="block truncate text-[15px] font-medium">{loading ? "Loading models…" : current ? current.name : placeholder}</span>
          {current ? <span className={`block truncate font-mono text-[11px] ${dark ? "text-muted-dark" : "text-muted"}`}>{priceLine(current)}</span> : null}
        </span>
        <ChevronDownIcon className={`size-4 shrink-0 ${dark ? "text-signal" : ""}`} />
      </button>
      {open ? (
        <div
          className={`absolute left-0 right-0 top-full z-30 mt-1 border shadow-[0_24px_48px_-20px_rgba(0,0,0,0.5)] ${
            dark ? "border-line-dark-strong bg-ink-2 text-paper" : "border-line-strong bg-white text-ink"
          }`}
        >
          <label className={`flex items-center gap-2 border-b px-3 ${dark ? "border-line-dark" : "border-line"}`}>
            <SearchIcon className="size-4 opacity-60" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${models.length} models`}
              className="h-11 min-w-0 flex-1 bg-transparent text-[14px] outline-none"
            />
          </label>
          <ul role="listbox" className="max-h-[320px] overflow-y-auto py-1">
            {matches.length === 0 ? <li className="px-3 py-3 text-[14px] opacity-70">No model matches.</li> : null}
            {matches.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={m.id === value}
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`block w-full px-3 py-2 text-left ${dark ? "hover:bg-ink-3" : "hover:bg-paper-2"} ${m.id === value ? "border-l-2 border-signal" : ""}`}
                >
                  <span className="block truncate text-[14px] font-medium">{m.name}</span>
                  <span className={`block truncate font-mono text-[10.5px] ${dark ? "text-muted-dark" : "text-muted"}`}>{priceLine(m)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
