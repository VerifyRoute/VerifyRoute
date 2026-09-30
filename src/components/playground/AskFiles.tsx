"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatError, DEFAULT_MODELS, estimateCost, formatMs, formatUsd, streamChat, type ChatResult } from "@/lib/chat";
import { pickDefault, useCatalog, useChatConfigured } from "@/components/playground/hooks";
import { ModelPicker } from "@/components/playground/ModelPicker";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { shortAddress } from "@/config/brand";
import { AlertIcon, ArrowRight, UploadIcon } from "@/components/icons";

const ACCEPT = [".txt", ".md", ".csv", ".json", ".html", ".htm"];
const LIMITS = { docs: 50, bytes: 2 * 1024 * 1024, chunks: 2000 };

type Doc = { id: string; name: string; text: string; bytes: number };
type Passage = { doc: string; index: number; text: string; score: number };

function htmlToText(html: string) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed.querySelectorAll("script,style,noscript").forEach((n) => n.remove());
  return parsed.body?.textContent ?? "";
}

function chunk(doc: Doc, size: number): Passage[] {
  const text = doc.text.replace(/\s+/g, " ").trim();
  const step = Math.max(50, Math.floor(size * 0.85)); // 15% overlap
  const out: Passage[] = [];
  for (let start = 0, i = 0; start < text.length; start += step, i++) {
    out.push({ doc: doc.id, index: i, text: text.slice(start, start + size), score: 0 });
    if (start + size >= text.length) break;
  }
  return out;
}

const STOP = new Set("the a an and or of to in on for with is are was were be by at as it this that from what which who how does do did can about into".split(" "));
const words = (s: string) => s.toLowerCase().match(/[a-z0-9]{2,}/g)?.filter((w) => !STOP.has(w)) ?? [];

function rank(passages: Passage[], question: string, top: number) {
  const q = new Set(words(question));
  if (q.size === 0) return passages.slice(0, top);
  return passages
    .map((p) => {
      const ws = words(p.text);
      const hits = ws.filter((w) => q.has(w)).length;
      const distinct = new Set(ws.filter((w) => q.has(w))).size;
      return { ...p, score: distinct * 3 + hits / Math.sqrt(ws.length + 1) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, top);
}

const fmtBytes = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KiB` : `${(n / 1024 / 1024).toFixed(2)} MiB`);

function StepHead({ n, title, on }: { n: number; title: string; on: boolean }) {
  return (
    <h2 className="flex items-center gap-4 text-[clamp(26px,2.6vw,34px)] font-[640] tracking-[-0.04em]">
      <span className={`grid size-[30px] place-items-center font-mono text-[13px] ${on ? "bg-signal text-ink" : "bg-ink text-paper"}`}>{n}</span>
      {title}
    </h2>
  );
}

export function AskFiles() {
  const catalog = useCatalog();
  const configured = useChatConfigured();
  const { address } = useWallet();
  const { open: openWallet } = useWalletModal();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState("");
  const [top, setTop] = useState(5);
  const [size, setSize] = useState(1200);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<{ text: string; result?: ChatResult; cost?: number | null; error?: string; used: Passage[] } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (catalog.status !== "ready" || model) return;
    const id = pickDefault(catalog.models, DEFAULT_MODELS);
    queueMicrotask(() => setModel(id));
  }, [catalog, model]);

  const bytes = docs.reduce((n, d) => n + d.bytes, 0);
  const passages = useMemo(() => docs.flatMap((d) => chunk(d, size)), [docs, size]);
  const over = { docs: docs.length > LIMITS.docs, bytes: bytes > LIMITS.bytes, chunks: passages.length > LIMITS.chunks };
  const within = !over.docs && !over.bytes && !over.chunks;
  const missing = [
    docs.length === 0 && "Add at least one file.",
    !question.trim() && "Write a question.",
    !model && "Choose a model.",
    configured === false && "Live answers are not configured on this deployment yet.",
  ].filter(Boolean) as string[];

  async function addFiles(list: FileList | File[]) {
    const next: Doc[] = [];
    const bad: string[] = [];
    let n = docs.length;
    for (const file of Array.from(list)) {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!ACCEPT.includes(ext)) {
        bad.push(`${file.name} (${ext === ".pdf" || ext === ".docx" ? "PDF and Word are not supported yet" : "unsupported type"})`);
        continue;
      }
      const raw = await file.text();
      const text = ext === ".html" || ext === ".htm" ? htmlToText(raw) : raw;
      n += 1;
      next.push({ id: `doc-${n}`, name: file.name, text, bytes: new Blob([text]).size });
    }
    setDocs((d) => [...d, ...next]);
    setRejected(bad);
    setAnswer(null);
  }

  async function ask() {
    if (missing.length || !within || busy) return;
    setBusy(true);
    const used = rank(passages, question, top);
    const context = used.map((p, i) => `[${i + 1}] (${p.doc}, passage ${p.index + 1})\n${p.text}`).join("\n\n");
    const system =
      "Answer the question using only the numbered passages. Cite every claim with the passage number in square brackets, like [1] or [2][3]. If the passages do not contain the answer, say so plainly. Be concise.";
    const messages = [
      { role: "system" as const, content: system },
      { role: "user" as const, content: `Passages:\n\n${context}\n\nQuestion: ${question.trim()}` },
    ];
    setAnswer({ text: "", used });
    try {
      const result = await streamChat({ model, messages, maxTokens: 1024, onText: (full) => setAnswer({ text: full, used }) });
      const chars = system.length + messages[1].content.length;
      const m = catalog.models.find((x) => x.id === model);
      setAnswer({ text: result.text, result, cost: result.reportedCost ?? estimateCost(m, result, chars), used });
    } catch (error) {
      setAnswer({ text: "", error: error instanceof ChatError ? error.message : "The answer was interrupted.", used });
    }
    setBusy(false);
  }

  function clear() {
    setDocs([]);
    setRejected([]);
    setAnswer(null);
    if (input.current) input.current.value = "";
  }

  const limitRows: [string, string, number, boolean][] = [
    ["Documents", `${docs.length} of ${LIMITS.docs}`, docs.length / LIMITS.docs, over.docs],
    ["Text", `${fmtBytes(bytes)} of ${fmtBytes(LIMITS.bytes)}`, bytes / LIMITS.bytes, over.bytes],
    ["Passages", `${passages.length.toLocaleString("en-US")} of ${LIMITS.chunks.toLocaleString("en-US")}`, passages.length / LIMITS.chunks, over.chunks],
    ["Sent to the model", `${Math.min(top, passages.length)} passages`, Math.min(top, passages.length) / 20, false],
  ];

  return (
    <div className="mt-16 grid gap-16">
      {configured === false ? (
        <div className="flex items-start gap-3 border border-line-strong border-l-[3px] border-l-warn bg-white px-5 py-4 text-[14.5px] leading-[1.5]">
          <AlertIcon className="mt-0.5 size-4 shrink-0 text-warn" />
          <span>
            <b className="font-semibold">Live answers are not configured on this deployment yet.</b> You can add files and see how they are cut and ranked; the question is
            sent once the operator adds a model key on the server.
          </span>
        </div>
      ) : null}

      <section>
        <StepHead n={1} title="Sign in (optional)" on={Boolean(address)} />
        <div className="mt-6 flex flex-col gap-4 border border-line bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] text-[14.5px] leading-[1.55] text-muted">
            Your wallet is your sign-in. It is not needed to try this page; once prepaid USDG balances go live, answers will be billed to the connected wallet&apos;s key.
          </p>
          {address ? (
            <span className="chip chip-signal w-fit">
              <i className="size-1.5 bg-signal-deep" /> {shortAddress(address, 6, 4)}
            </span>
          ) : (
            <button type="button" onClick={openWallet} className="btn btn-sm btn-cut btn-dot btn-solid-dark w-fit">
              Connect wallet <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </section>

      <section>
        <StepHead n={2} title="Your files" on={docs.length > 0} />
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
          }}
          className={`mt-6 flex flex-col items-center justify-center gap-3 border-2 border-dashed px-5 py-12 text-center transition-colors ${
            drag ? "border-signal-deep bg-signal-tint" : "border-line-strong/40 bg-white"
          }`}
        >
          <UploadIcon className="size-6" />
          <p className="text-[17px] font-medium">Drop files here</p>
          <button type="button" onClick={() => input.current?.click()} className="link-u text-[14.5px]">
            or choose files
          </button>
          <input ref={input} type="file" multiple accept={ACCEPT.join(",")} className="sr-only" onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <p className="max-w-[560px] text-[13px] leading-[1.5] text-muted">Reads .txt, .md, .csv, .json and .html in this browser. PDF and Word files are not supported yet.</p>
        </div>
        {rejected.length ? <p className="mt-3 text-[13.5px] text-danger">Skipped: {rejected.join(", ")}.</p> : null}
        {docs.length ? (
          <ul className="mt-4 grid gap-1.5">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 border border-line bg-white px-4 py-2.5 text-[14px]">
                <span className="min-w-0 truncate">
                  <span className="font-mono text-[11px] text-muted">{d.id}</span> <span className="ml-2">{d.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3 font-mono text-[11px] text-muted">
                  {fmtBytes(d.bytes)}
                  <button type="button" aria-label={`Remove ${d.name}`} onClick={() => setDocs((all) => all.filter((x) => x.id !== d.id))} className="hover:text-danger">
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 border border-line bg-white px-5 py-5">
          <h3 className="text-[18px] font-[620] tracking-[-0.02em]">Before you send</h3>
          <ul className="mt-4 grid gap-3">
            {limitRows.map(([k, v, frac, bad]) => (
              <li key={k} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[150px_180px_minmax(0,1fr)_auto] sm:gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{k}</span>
                <span className="text-[14.5px]">{v}</span>
                <span className="h-1.5 bg-paper-2">
                  <span className={`block h-full ${bad ? "bg-danger" : "bg-signal-deep"}`} style={{ width: `${Math.min(100, frac * 100)}%` }} />
                </span>
                <span className={`chip w-fit ${bad ? "border-danger/40 bg-danger-tint text-danger" : "chip-signal"}`}>{bad ? "Over the limit" : "Within the limit"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[760px] text-[13px] leading-[1.55] text-muted">
            Limits for one question on this page: {LIMITS.docs} documents, {fmtBytes(LIMITS.bytes)} of text and {LIMITS.chunks.toLocaleString("en-US")} passages. Over any of
            them nothing is sent.
          </p>
        </div>
      </section>

      <section>
        <StepHead n={3} title="Your question" on={question.trim().length > 0} />
        <label className="mt-6 block">
          <span className="mono-label text-muted">Question</span>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, 2000))}
            rows={4}
            placeholder="What does the policy say about refunds after 30 days?"
            className="field mt-2"
          />
        </label>

        <fieldset className="mt-8">
          <legend className="mono-label text-muted">Lane</legend>
          <div className="mt-2 grid gap-2">
            <label className="flex cursor-pointer gap-4 border border-line-strong border-l-[3px] border-l-signal-deep bg-white px-5 py-4">
              <input type="radio" name="lane" defaultChecked className="mt-1 accent-[#0a7d31]" />
              <span>
                <span className="block text-[15.5px] font-semibold">Standard (default)</span>
                <span className="mt-1 block text-[13.5px] leading-[1.5] text-muted">The router&apos;s ordinary lane. The chosen model&apos;s provider and its published data policy apply to your passages.</span>
              </span>
            </label>
            <label className="flex cursor-not-allowed gap-4 border border-line bg-white/60 px-5 py-4 opacity-70">
              <input type="radio" name="lane" disabled className="mt-1" />
              <span>
                <span className="flex flex-wrap items-center gap-2 text-[15.5px] font-semibold">
                  Attested <span className="chip chip-warn">Preview</span>
                </span>
                <span className="mt-1 block text-[13.5px] leading-[1.5] text-muted">
                  Only hosts whose TEE quote the router verified minutes ago, failing closed otherwise. Opens with the attested lanes on the roadmap.
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <span className="mono-label text-muted">Chat model</span>
            <div className="mt-2">
              <ModelPicker models={catalog.models} value={model} onChange={setModel} loading={catalog.status === "loading"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mono-label text-muted">Passages to use</span>
              <input type="number" min={1} max={20} value={top} onChange={(e) => setTop(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className="field mt-2" />
            </label>
            <label className="block">
              <span className="mono-label text-muted">Passage size</span>
              <input
                type="number"
                min={200}
                max={4000}
                step={100}
                value={size}
                onChange={(e) => setSize(Math.max(200, Math.min(4000, Number(e.target.value) || 1200)))}
                className="field mt-2"
              />
            </label>
          </div>
        </div>
        <p className="mt-3 max-w-[760px] text-[13px] leading-[1.55] text-muted">
          Files are cut into overlapping passages of this many characters (200 to 4,000; 15% overlap). The best 1 to 20 by word overlap with your question go to the
          model.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={ask} disabled={missing.length > 0 || !within || busy} className="btn btn-cut btn-dot btn-solid-dark">
            {busy ? "Asking…" : "Ask"} <ArrowRight className="size-4" />
          </button>
          <button type="button" onClick={clear} className="btn btn-outline-dark">
            Clear files and answer
          </button>
        </div>
        {missing.length ? (
          <ul className="mt-4 grid gap-1 text-[13.5px] text-muted">
            {missing.map((m) => (
              <li key={m}>· {m}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[13.5px] text-muted">Nothing is sent until you press Ask.</p>
        )}
      </section>

      {answer ? (
        <section className="border border-line-strong bg-white" aria-live="polite">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.08em]">
            <span>Answer · standard lane</span>
            <span className="text-muted">{catalog.models.find((m) => m.id === model)?.name ?? model}</span>
          </div>
          <div className="min-h-[80px] whitespace-pre-wrap break-words px-5 py-5 text-[15.5px] leading-[1.65]">
            {answer.error ? <span className="text-danger">{answer.error}</span> : answer.text || <span className="text-muted">Waiting for the first token…</span>}
          </div>
          <dl className="grid grid-cols-2 border-t border-line font-mono text-[11px] sm:grid-cols-4">
            {[
              ["First token", formatMs(answer.result?.firstTokenMs ?? null)],
              ["Total", answer.result ? formatMs(answer.result.totalMs) : "—"],
              ["Tokens", answer.result?.completionTokens != null ? `${answer.result.promptTokens ?? "?"} in · ${answer.result.completionTokens} out` : "—"],
              [answer.result?.reportedCost != null ? "Cost" : "Cost (estimate)", formatUsd(answer.cost ?? null)],
            ].map(([k, v], i) => (
              <div key={k} className={`px-4 py-2.5 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}>
                <dt className="uppercase tracking-[0.06em] text-muted">{k}</dt>
                <dd className="mt-1 truncate">{v}</dd>
              </div>
            ))}
          </dl>
          <details className="border-t border-line px-5 py-4">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.08em]">Passages sent ({answer.used.length})</summary>
            <ol className="mt-4 grid gap-3">
              {answer.used.map((p, i) => (
                <li key={`${p.doc}-${p.index}`} className="border-l-2 border-signal pl-3 text-[13.5px] leading-[1.55] text-muted">
                  <span className="font-mono text-[11px] text-ink">
                    [{i + 1}] {p.doc} · {docs.find((d) => d.id === p.doc)?.name} · passage {p.index + 1}
                  </span>
                  <p className="mt-1 line-clamp-4">{p.text}</p>
                </li>
              ))}
            </ol>
          </details>
          <p className="border-t border-line px-5 py-2.5 font-mono text-[11px] text-muted">Receipt: signing arrives with the router (preview)</p>
        </section>
      ) : null}
    </div>
  );
}
