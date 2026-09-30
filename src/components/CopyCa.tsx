"use client";

import { useState } from "react";
import { BRAND, TOKEN, explorerToken, shortAddress } from "@/config/brand";
import { CheckIcon, CopyIcon, GithubIcon, XIcon } from "@/components/icons";

function useCopyCa() {
  const [copied, setCopied] = useState(false);
  const live = TOKEN.isLive;
  const copy = async () => {
    if (!live) return;
    try {
      await navigator.clipboard.writeText(BRAND.ca);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the address stays visible to select by hand.
    }
  };
  return { live, copied, copy };
}

/** Compact navbar pill: ticker plus a copy icon. Calm until the CA is published. */
export function NavCaPill({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { live, copied, copy } = useCopyCa();
  const border = tone === "dark" ? "border-line-dark-strong text-paper hover:bg-paper/10" : "border-line-strong text-ink hover:bg-ink/5";
  return (
    <button
      type="button"
      onClick={copy}
      data-copy-ca="nav"
      title={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract is published at launch`}
      aria-label={live ? `Copy ${BRAND.symbol} contract address` : `${BRAND.symbol} contract address, published at launch`}
      className={`flex h-[38px] shrink-0 items-center gap-2 border px-2.5 transition-colors ${border} ${live ? "" : "cursor-default"}`}
    >
      <span className="font-mono text-[11px] font-semibold tracking-[0.04em] text-signal">{BRAND.symbol}</span>
      <span className={`hidden font-mono text-[10.5px] uppercase tracking-[0.06em] 2xl:inline ${tone === "dark" ? "text-muted-dark" : "text-muted"}`}>
        {live ? shortAddress(BRAND.ca, 4, 4) : "CA soon"}
      </span>
      {copied ? <CheckIcon className="size-3.5 text-signal" /> : <CopyIcon className={`size-3.5 ${live ? "" : "opacity-40"}`} />}
    </button>
  );
}

/** Hero strip: full address with a copy button, like a receipt line. */
export function CaStrip({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { live, copied, copy } = useCopyCa();
  const dark = tone === "dark";
  return (
    <div className={`flex max-w-full items-center gap-3 border px-3 py-2.5 ${dark ? "border-line-dark bg-paper/[0.03]" : "border-line bg-white/60"}`}>
      <span className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-signal">{BRAND.symbol} CA</span>
      <span className={`min-w-0 flex-1 truncate font-mono text-[12.5px] ${dark ? "text-paper" : "text-ink"}`}>
        {live ? BRAND.ca : "Published at launch"}
      </span>
      <button
        type="button"
        onClick={copy}
        disabled={!live}
        data-copy-ca="hero"
        className={`shrink-0 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors disabled:opacity-40 ${
          dark ? "border-line-dark text-muted-dark hover:text-paper" : "border-line text-muted hover:text-ink"
        }`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** Token contract block for the footer. */
export function CaBlock() {
  const { live, copied, copy } = useCopyCa();
  return (
    <div className="w-full max-w-[400px]">
      <p className="mono-label text-muted-dark">{BRAND.symbol} contract · Robinhood Chain</p>
      <div className="mt-3 flex items-center gap-2 border border-line-dark bg-ink-2 p-1.5 pl-3.5">
        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-paper">{live ? shortAddress(BRAND.ca, 10, 8) : "Published at launch"}</span>
        <button
          type="button"
          onClick={copy}
          disabled={!live}
          data-copy-ca="footer"
          aria-label="Copy contract address"
          className="grid size-9 place-items-center border border-line-dark text-paper transition-colors hover:border-signal disabled:opacity-40"
        >
          {copied ? <CheckIcon className="size-4 text-signal" /> : <CopyIcon className="size-4" />}
        </button>
      </div>
      <div className="mt-4 flex items-center gap-5 text-[14px] text-muted-dark">
        {live && (
          <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" className="hover:text-paper">
            Explorer
          </a>
        )}
        <a href={BRAND.x} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-paper">
          <XIcon className="size-4" /> {BRAND.xHandle}
        </a>
        {BRAND.github && (
          <a href={BRAND.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-paper">
            <GithubIcon className="size-4" /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}
