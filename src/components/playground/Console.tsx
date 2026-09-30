"use client";

import { useEffect, useRef, useState } from "react";
import type { Model } from "@/lib/models";
import { ChatError, DEFAULT_MODELS, estimateCost, formatMs, formatUsd, streamChat, type ChatMessage, type ChatResult } from "@/lib/chat";
import { pickDefault, useCatalog, useChatConfigured } from "@/components/playground/hooks";
import { ModelPicker } from "@/components/playground/ModelPicker";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { shortAddress } from "@/config/brand";
import { AlertIcon, ArrowRight } from "@/components/icons";

type Reply = { model: string; text: string; status: "streaming" | "done" | "error"; result?: ChatResult; cost?: number | null; error?: string };
type Turn = { prompt: string; replies: Reply[] };

const SUGGESTIONS = [
  "Explain what a signed receipt proves about an AI call, in three short paragraphs.",
  "Write a TypeScript function that validates an Ethereum address, with three test cases.",
  "Compare a hardware enclave quote with a privacy policy. Which one can a user check?",
  "Suggest three names for a quiet coffee grinder, as JSON with name and reason.",
];

function Toggle({ on, onClick, label, hint, disabled = false }: { on: boolean; onClick: () => void; label: string; hint?: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} disabled={disabled} onClick={onClick} className="flex items-center gap-2.5 text-left disabled:cursor-not-allowed">
      <span className={`relative h-5 w-9 shrink-0 border ${on ? "border-ink bg-ink" : "border-line-strong/40 bg-white"}`}>
        <span className={`absolute top-[2px] size-[14px] transition-all ${on ? "left-[18px] bg-signal" : "left-[2px] bg-paper-3"}`} />
      </span>
      <span className="text-[14.5px] font-medium">{label}</span>
      {hint ? <span className="hidden font-mono text-[11px] text-muted sm:inline">{hint}</span> : null}
    </button>
  );
}

export function Console() {
  const catalog = useCatalog();
  const configured = useChatConfigured();
  const { address } = useWallet();
  const { open: openWallet } = useWalletModal();
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [compare, setCompare] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);

  // Pick defaults once the catalog arrives; a ?model= link wins.
  useEffect(() => {
    if (catalog.status !== "ready" || primary) return;
    const wanted = new URLSearchParams(window.location.search).get("model");
    const first = wanted && catalog.models.some((m) => m.id === wanted) ? wanted : pickDefault(catalog.models, DEFAULT_MODELS);
    const second = pickDefault(
      catalog.models.filter((m) => m.id !== first),
      DEFAULT_MODELS,
    );
    // Deferred so the state update does not run synchronously inside the effect.
    queueMicrotask(() => {
      setPrimary(first);
      setSecondary(second);
    });
  }, [catalog, primary]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [turns.length]);

  const byId = (id: string): Model | undefined => catalog.models.find((m) => m.id === id);
  const active = compare && secondary ? [primary, secondary] : [primary];
  const canSend = configured === true && !busy && input.trim().length > 0 && Boolean(primary);

  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || !configured || busy || !primary) return;
    setInput("");
    setBusy(true);
    const index = turns.length;
    const history = turns;
    setTurns((t) => [...t, { prompt, replies: active.map((model) => ({ model, text: "", status: "streaming" as const })) }]);
    const controller = new AbortController();
    abort.current = controller;

    await Promise.all(
      active.map(async (model, lane) => {
        const messages: ChatMessage[] = [];
        for (const turn of history) {
          messages.push({ role: "user", content: turn.prompt });
          const r = turn.replies[lane] ?? turn.replies[0];
          if (r?.text) messages.push({ role: "assistant", content: r.text });
        }
        messages.push({ role: "user", content: prompt });
        const update = (patch: Partial<Reply>) =>
          setTurns((all) => all.map((t, i) => (i !== index ? t : { ...t, replies: t.replies.map((r, j) => (j === lane ? { ...r, ...patch } : r)) })));
        try {
          const result = await streamChat({ model, messages, maxTokens: 1024, signal: controller.signal, onText: (full) => update({ text: full }) });
          const chars = messages.reduce((n, m) => n + m.content.length, 0);
          update({ status: "done", result, text: result.text, cost: result.reportedCost ?? estimateCost(byId(model), result, chars) });
        } catch (error) {
          const message = error instanceof ChatError ? error.message : controller.signal.aborted ? "Stopped." : "The reply was interrupted.";
          update({ status: "error", error: message });
        }
      }),
    );
    setBusy(false);
    abort.current = null;
  }

  const models = catalog.models;
  return (
    <div className="min-h-[calc(100dvh-var(--header))] bg-paper">
      <div className="mx-auto flex w-full max-w-[800px] flex-col px-4 sm:px-6">
        <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:max-w-[420px]">
            <ModelPicker models={models} value={primary} onChange={setPrimary} loading={catalog.status === "loading"} label={compare ? "Model A" : undefined} />
            {compare ? <ModelPicker models={models} value={secondary} onChange={setSecondary} loading={catalog.status === "loading"} label="Model B" /> : null}
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:pt-2.5">
            <Toggle on={compare} onClick={() => setCompare((v) => !v)} label="Compare" />
            {address ? (
              <span className="chip bg-white text-ink">
                <i className="size-1.5 bg-signal" /> {shortAddress(address, 5, 4)}
              </span>
            ) : (
              <button type="button" onClick={openWallet} className="btn btn-sm btn-cut btn-dot btn-solid-dark">
                Sign in
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Toggle on={privateMode} onClick={() => setPrivateMode((v) => !v)} label="Private mode" hint="attested hosts only · a label on every reply" />
          <span className="chip chip-warn">Design preview</span>
        </div>
        {privateMode ? (
          <p className="mt-3 border-l-[3px] border-warn bg-white px-4 py-3 text-[13.5px] leading-[1.5] text-muted">
            Attested lanes are not live yet. With private mode on, replies are still served on the standard lane and are labelled that way. Nothing claims a TEE
            that was not checked.
          </p>
        ) : null}

        {configured === false ? (
          <div className="mt-6 flex items-start gap-3 border border-line-strong bg-white px-4 py-3.5 text-[14px] leading-[1.5]">
            <AlertIcon className="mt-0.5 size-4 shrink-0 text-warn" />
            <span>
              <b className="font-semibold">Live chat is not configured on this deployment yet.</b> The catalog and model picker are live; sending a message needs the
              operator&apos;s model key on the server.
            </span>
          </div>
        ) : null}

        {turns.length === 0 ? (
          <section className="pb-10 pt-14 sm:pt-20">
            <h1 className="text-[clamp(50px,7vw,86px)] font-[660] leading-[0.9] tracking-[-0.055em]">
              <span className="block">Every model.</span>
              <span className="mt-1 inline-block bg-signal px-1.5 pb-1">One page.</span>
            </h1>
            <p className="mt-6 max-w-[480px] text-[17px] leading-[1.5] text-muted">
              Pick a model above and type below. Every reply shows how fast it came, how many tokens it used and an estimate of what it cost.
            </p>
            <p className="mt-5 flex items-center gap-2 font-mono text-[12px] text-muted">
              <i className="size-1.5 bg-signal" />
              {catalog.status === "ready"
                ? `${models.length} models from ${catalog.makers} makers, live`
                : catalog.status === "loading"
                  ? "Reading the live catalog…"
                  : "The live catalog did not answer; reload in a moment"}
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => (configured ? send(s) : setInput(s))}
                    className="flex h-full w-full items-end justify-between gap-4 bg-paper-2 px-4 py-4 text-left text-[15px] leading-[1.4] transition-colors hover:bg-paper-3"
                  >
                    <span>{s}</span>
                    <ArrowRight className="size-4 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="grid gap-10 pb-10 pt-10" aria-live="polite">
            {turns.map((turn, i) => (
              <div key={i} className="grid gap-4">
                <p className="ml-auto max-w-[85%] whitespace-pre-wrap bg-ink px-4 py-3 text-[15px] leading-[1.5] text-paper">{turn.prompt}</p>
                <div className={`grid grid-cols-1 gap-4 ${turn.replies.length > 1 ? "md:grid-cols-2" : ""}`}>
                  {turn.replies.map((r, j) => (
                    <ReplyCard key={j} reply={r} model={byId(r.model)} privateMode={privateMode} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
        <div ref={end} />

        <div className="sticky bottom-0 mt-auto bg-paper pb-4 pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="corner-cut flex items-end gap-2 bg-ink p-2 text-paper"
          >
            <label className="sr-only" htmlFor="console-input">
              Message
            </label>
            <textarea
              id="console-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              maxLength={8000}
              placeholder={byId(primary) ? `Message ${byId(primary)!.name}` : "Message"}
              className="max-h-40 min-h-[48px] min-w-0 flex-1 resize-none bg-transparent px-3 py-3 text-[16px] outline-none placeholder:text-muted-dark"
            />
            {busy ? (
              <button type="button" onClick={() => abort.current?.abort()} className="btn btn-sm btn-outline-light">
                Stop
              </button>
            ) : (
              <button type="submit" disabled={!canSend} className="btn btn-sm bg-ink-3 text-paper hover:bg-ink-4">
                Send ↵
              </button>
            )}
          </form>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Enter sends · Shift + Enter for a new line · {configured === false ? "sending is off on this deployment" : "replies stream through the router"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReplyCard({ reply, model, privateMode }: { reply: Reply; model: Model | undefined; privateMode: boolean }) {
  const r = reply.result;
  return (
    <article className="min-w-0 border border-line-strong bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em]">
        <span className="truncate">{model?.name ?? reply.model}</span>
        <span className="shrink-0 text-muted">{privateMode ? "standard lane · attested not live" : "standard lane"}</span>
      </div>
      <div className="min-h-[72px] whitespace-pre-wrap break-words px-4 py-4 text-[15px] leading-[1.6]">
        {reply.status === "error" ? (
          <span className="text-danger">{reply.error}</span>
        ) : reply.text ? (
          reply.text
        ) : (
          <span className="text-muted">Waiting for the first token…</span>
        )}
        {reply.status === "streaming" && reply.text ? <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-blink bg-signal" /> : null}
      </div>
      <dl className="grid grid-cols-2 border-t border-line font-mono text-[11px] sm:grid-cols-4">
        {[
          ["First token", formatMs(r?.firstTokenMs ?? null)],
          ["Total", r ? formatMs(r.totalMs) : "—"],
          ["Tokens", r && (r.promptTokens !== null || r.completionTokens !== null) ? `${r.promptTokens ?? "?"} in · ${r.completionTokens ?? "?"} out` : "—"],
          [r?.reportedCost !== null && r?.reportedCost !== undefined ? "Cost" : "Cost (estimate)", formatUsd(reply.cost ?? null)],
        ].map(([k, v], i) => (
          <div key={k} className={`px-3 py-2.5 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}>
            <dt className="uppercase tracking-[0.06em] text-muted">{k}</dt>
            <dd className="mt-1 truncate">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-muted">Receipt: signing arrives with the router (preview)</p>
    </article>
  );
}
