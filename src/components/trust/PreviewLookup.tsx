"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/icons";

/** Lookup form for records the router will publish. Until then it says so plainly. */
export function PreviewLookup({ label, placeholder, button, empty }: { label: string; placeholder: string; button: string; empty: string }) {
  const [value, setValue] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) setAsked(value.trim());
      }}
    >
      <label className="mono-label text-muted">
        {label}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} spellCheck={false} className="field min-w-0 flex-1 font-mono text-[13px] normal-case tracking-normal sm:max-w-[400px]" />
          <button type="submit" disabled={!value.trim()} className="btn btn-cut btn-dot btn-solid-dark">
            {button} <ArrowRight className="size-4" />
          </button>
        </div>
      </label>
      {asked ? (
        <p role="status" className="mt-4 border border-line border-l-[3px] border-l-warn bg-white px-4 py-3 text-[14.5px] leading-[1.5]">
          <span className="font-mono text-[12px]">{asked}</span>: {empty}
        </p>
      ) : null}
    </form>
  );
}
