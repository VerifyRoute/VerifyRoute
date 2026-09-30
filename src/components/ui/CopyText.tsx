"use client";

import { useState } from "react";

/** Small "Copy" control for code panels and ids. */
export function CopyText({ text, className = "", label = "Copy" }: { text: string; className?: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          window.setTimeout(() => setDone(false), 1400);
        } catch {
          // Clipboard blocked: the text stays selectable.
        }
      }}
      className={`border-b-2 border-signal pb-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors hover:text-signal ${className}`}
    >
      {done ? "Copied" : label}
    </button>
  );
}
