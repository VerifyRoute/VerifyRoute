"use client";

import { useState } from "react";
import { SearchIcon } from "@/components/icons";

/* Provider list. No provider has bonded yet, so the list is empty and says so;
   the search and filter are wired for when records exist. */

type Provider = { id: string; name: string; attested: boolean };
const PROVIDERS: Provider[] = [];

export function ProviderList() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "attested" | "not">("all");
  const shown = PROVIDERS.filter(
    (p) => (filter === "all" || (filter === "attested") === p.attested) && `${p.id} ${p.name}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search providers</span>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search providers" className="field pl-10" />
        </label>
        <div role="group" aria-label="Filter" className="flex border border-line-strong bg-white">
          {(
            [
              ["all", "All"],
              ["attested", "Attested"],
              ["not", "Not attested"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`flex-1 whitespace-nowrap px-4 font-mono text-[11px] uppercase tracking-[0.06em] sm:flex-none ${filter === id ? "bg-ink text-paper" : "text-muted hover:text-ink"} h-[48px]`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 ? (
        <div className="mt-6 border border-dashed border-line-strong/40 bg-white/60 px-6 py-10 text-center">
          <p className="text-[20px] font-[640] tracking-[-0.03em]">No providers on record yet</p>
          <p className="mx-auto mt-2 max-w-[520px] text-[15px] leading-[1.55] text-muted">
            Providers are listed once they post their 10,000 USDG bond and pass their first canary set. Nothing here is hidden: the list is empty because bonding has not opened.
          </p>
        </div>
      ) : null}
    </div>
  );
}
