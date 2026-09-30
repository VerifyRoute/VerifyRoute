"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChatError, DEFAULT_MODELS, estimateCost, formatMs, formatUsd, streamChat, type ChatResult } from "@/lib/chat";
import { pickDefault, useCatalog, useChatConfigured } from "@/components/playground/hooks";
import { ModelPicker } from "@/components/playground/ModelPicker";
import { ProofBars } from "@/components/site/ProofBars";
import { ArrowRight } from "@/components/icons";

type Lane = { model: string; text: string; status: "idle" | "streaming" | "done" | "error"; result?: ChatResult; cost?: number | null; error?: string };

const CAPS = [256, 512, 1024, 2048];
const MAX_PROMPT = 8000;

export function Arena() {
  const catalog = useCatalog();
  const configured = useChatConfigured();
  const [prompt, setPrompt] = useState("");
  const [lanes, setLanes] = useState<Lane[]>([
    { model: "", text: "", status: "idle" },
    { model: "", text: "", status: "idle" },
  ]);
  const [cap, setCap] = useState(1024);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [racing, setRacing] = useState(false);
  const [copied, setCopied] = useState(false);
  const seeded = useRef(false);

  // Seed lanes from ?models=a,b or from sensible defaults once the catalog loads.
  useEffect(() => {
    if (catalog.status !== "ready" || seeded.current) return;
    seeded.current = true;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get("models") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((id) => catalog.models.some((m) => m.id === id))
      .slice(0, 4);
    const picks = [...fromUrl];
    for (const id of DEFAULT_MODELS) {
      if (picks.length >= 2) break;
      if (!picks.includes(id) && catalog.models.some((m) => m.id === id)) picks.push(id);
    }
    if (picks.length < 2) picks.push(pickDefault(catalog.models.filter((m) => !picks.includes(m.id)), []));
    const q = params.get("q");
    queueMicrotask(() => {
      setLanes(picks.map((model) => ({ model, text: "", status: "idle" as const })));
      if (q) setPrompt(q.slice(0, MAX_PROMPT));
    });
  }, [catalog]);

  const byId = (id: string) => catalog.models.find((m) => m.id === id);
  const ready = configured === true && prompt.trim().length > 0 && lanes.every((l) => l.model) && !racing;

  async function race() {
    if (!ready) return;
    setRacing(true);
    const text = prompt.trim();
    setLanes((all) => all.map((l) => ({ model: l.model, text: "", status: "streaming" as const })));
    await Promise.all(
      lanes.map(async (lane, i) => {
        const update = (patch: Partial<Lane>) => setLanes((all) => all.map((l, j) => (j === i ? { ...l, ...patch } : l)));
        try {
          const result = await streamChat({ model: lane.model, messages: [{ role: "user", content: text }], maxTokens: cap, onText: (full) => update({ text: full }) });
          update({ status: "done", text: result.text, result, cost: result.reportedCost ?? estimateCost(byId(lane.model), result, text.length) });
        } catch (error) {
          update({ status: "error", error: error instanceof ChatError ? error.message : "The lane was interrupted." });
        }
      }),
    );
    setRacing(false);
  }

  async function copyLink() {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("models", lanes.map((l) => l.model).filter(Boolean).join(","));
    if (prompt.trim()) url.searchParams.set("q", prompt.trim().slice(0, 500));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  }

  const fastest = (() => {
    const done = lanes.filter((l) => l.status === "done" && l.result?.firstTokenMs != null);
    if (done.length < 2) return null;
    return done.reduce((a, b) => ((a.result!.firstTokenMs ?? Infinity) <= (b.result!.firstTokenMs ?? Infinity) ? a : b)).model;
  })();

  return (
    <div className="on-dark relative -mt-[var(--header)] overflow-hidden bg-ink pt-[var(--header)] text-paper">
      <div className="gridlines absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_90%_0%,rgba(31,225,90,0.12),transparent_70%)]" aria-hidden="true" />
      <div className="wrap relative pb-56 pt-14 sm:pt-[88px]">
        <p className="kicker">
          <span className="text-signal">▲</span> Model arena · live race
        </p>
        <h1 className="mt-8 text-[clamp(50px,7.6vw,110px)] font-[660] leading-[0.9] tracking-[-0.055em]">
          <span className="block">One prompt.</span>
          <span className="block text-signal">Every model, timed.</span>
        </h1>
        <p className="lede mt-8 max-w-[600px] text-muted-dark">
          Send the same prompt to two, three or four models at once. Answers stream side by side, and each lane ends with its first token, total time, tokens and an
          estimate of what it cost.
        </p>

        {configured === false ? (
          <div className="mt-12 flex flex-col gap-4 border border-warn/60 border-l-[3px] border-l-warn bg-ink-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[16px] font-semibold">Live racing is not configured on this deployment yet.</p>
              <p className="mt-1 text-[14px] text-muted-dark">
                Pick models and write a prompt now; the race starts once the operator adds a model key on the server. Nothing is sent until then.
              </p>
            </div>
            <Link href="/dashboard" className="btn btn-cut btn-dot btn-solid-light shrink-0">
              Open dashboard <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : null}

        <label className="mt-10 block">
          <span className="mono-label text-muted-dark">Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, MAX_PROMPT))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                race();
              }
            }}
            rows={5}
            placeholder="Explain in three sentences how a Merkle proof lets anyone check one receipt."
            className="field field-dark mt-2"
          />
        </label>
        <p className="mt-2 font-mono text-[11.5px] text-muted-dark">
          {prompt.length.toLocaleString("en-US")} / {MAX_PROMPT.toLocaleString("en-US")} · Ctrl/⌘ + Enter races
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <button
            type="button"
            role="switch"
            aria-checked={verifiedOnly}
            onClick={() => setVerifiedOnly((v) => !v)}
            className="flex items-start gap-4 border border-line-dark bg-ink-2 px-4 py-4 text-left"
          >
            <span className={`relative mt-0.5 h-5 w-9 shrink-0 border ${verifiedOnly ? "border-signal bg-ink" : "border-line-dark-strong bg-ink-3"}`}>
              <span className={`absolute top-[2px] size-[14px] transition-all ${verifiedOnly ? "left-[18px] bg-signal" : "left-[2px] bg-paper/70"}`} />
            </span>
            <span>
              <span className="flex flex-wrap items-center gap-2 text-[15px] font-medium">
                Verified providers only <span className="chip chip-dark !text-warn">Preview</span>
              </span>
              <span className="mt-1 block text-[13.5px] text-muted-dark">
                Once bonds go live, each lane will require a bonded provider with a passing canary record and fail rather than fall back. Today every lane uses the
                standard route.
              </span>
            </span>
          </button>
          <div className="flex items-center border border-line-dark bg-ink-2 px-4 py-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-dark">
            {lanes.length} lanes · {verifiedOnly ? "verified (preview)" : "standard"}
          </div>
        </div>

        <div className={`mt-6 grid grid-cols-1 gap-4 ${lanes.length > 1 ? "md:grid-cols-2" : ""}`}>
          {lanes.map((lane, i) => (
            <section key={i} className="min-w-0 border border-line-dark bg-ink-2 p-4">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <ModelPicker
                    tone="dark"
                    label={`Lane ${i + 1}${fastest && fastest === lane.model ? " · first token first" : ""}`}
                    models={catalog.models}
                    loading={catalog.status === "loading"}
                    value={lane.model}
                    onChange={(id) => setLanes((all) => all.map((l, j) => (j === i ? { model: id, text: "", status: "idle" } : l)))}
                  />
                </div>
                {lanes.length > 2 ? (
                  <button
                    type="button"
                    aria-label={`Remove lane ${i + 1}`}
                    disabled={racing}
                    onClick={() => setLanes((all) => all.filter((_, j) => j !== i))}
                    className="grid h-[62px] w-10 place-items-center border border-line-dark-strong text-muted-dark hover:text-paper"
                  >
                    ×
                  </button>
                ) : null}
              </div>
              <div className="mt-3 h-[220px] overflow-y-auto whitespace-pre-wrap break-words border border-line-dark bg-ink px-4 py-3.5 text-[14.5px] leading-[1.6]">
                {lane.status === "error" ? (
                  <span className="text-danger">{lane.error}</span>
                ) : lane.text ? (
                  lane.text
                ) : (
                  <span className="text-muted-dark">{lane.status === "streaming" ? "Waiting for the first token…" : "The answer streams here."}</span>
                )}
              </div>
              <dl className="mt-3 grid grid-cols-2 border border-line-dark font-mono text-[11px]">
                {[
                  ["First token", formatMs(lane.result?.firstTokenMs ?? null)],
                  ["Total", lane.result ? formatMs(lane.result.totalMs) : "—"],
                  ["Tokens", lane.result?.completionTokens != null ? `${lane.result.promptTokens ?? "?"} in · ${lane.result.completionTokens} out` : "—"],
                  [lane.result?.reportedCost != null ? "Cost" : "Cost (estimate)", formatUsd(lane.cost ?? null)],
                ].map(([k, v], j) => (
                  <div key={k} className={`px-3 py-2.5 ${j % 2 ? "border-l border-line-dark" : ""} ${j > 1 ? "border-t border-line-dark" : ""}`}>
                    <dt className="uppercase tracking-[0.08em] text-muted-dark">{k}</dt>
                    <dd className="mt-1 truncate">{v}</dd>
                  </div>
                ))}
                <div className="col-span-2 border-t border-line-dark px-3 py-2.5">
                  <dt className="uppercase tracking-[0.08em] text-muted-dark">Receipt</dt>
                  <dd className="mt-1 text-muted-dark">Signing arrives with the router (preview)</dd>
                </div>
              </dl>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line-dark pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={race} disabled={!ready} className="btn btn-cut btn-dot btn-solid-light">
              {racing ? "Racing…" : "Race"} <ArrowRight className="size-4" />
            </button>
            <button type="button" onClick={copyLink} className="btn btn-outline-light">
              {copied ? "Link copied" : "Copy link"}
            </button>
            <button
              type="button"
              disabled={lanes.length >= 4 || racing}
              onClick={() => {
                const used = lanes.map((l) => l.model);
                const next = pickDefault(catalog.models.filter((m) => !used.includes(m.id)), DEFAULT_MODELS);
                setLanes((all) => [...all, { model: next, text: "", status: "idle" }]);
              }}
              className="btn btn-outline-light"
            >
              + Add lane
            </button>
          </div>
          <label className="flex items-center gap-3">
            <span className="mono-label text-muted-dark">Answer cap</span>
            <select value={cap} onChange={(e) => setCap(Number(e.target.value))} className="field field-dark !h-[46px] !w-auto cursor-pointer font-mono !text-[13px]">
              {CAPS.map((c) => (
                <option key={c} value={c}>
                  {c.toLocaleString("en-US")} tokens
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 font-mono text-[12px] text-muted-dark">
          {configured === false
            ? "Racing needs the operator's model key on the server."
            : configured === null
              ? "Checking the chat relay…"
              : prompt.trim()
                ? "Ready to race."
                : "Write a prompt to race."}
        </p>
      </div>
      <ProofBars className="pointer-events-none absolute bottom-0 right-0 h-[200px] w-[62%] rotate-180 -scale-x-100" />
    </div>
  );
}
