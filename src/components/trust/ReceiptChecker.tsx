"use client";

import { useState } from "react";
import { ArrowRight, CheckIcon, AlertIcon } from "@/components/icons";
import { SAMPLE_RECEIPT } from "@/components/trust/sample-receipt";

/* Receipt checker that runs entirely in this browser. The payload is
   canonicalized (keys sorted at every level, no whitespace), then the
   Ed25519 signature is checked with WebCrypto. Nothing is sent anywhere. */

type Result = { ok: true; key: string } | { ok: false; reason: string } | null;

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function hexToBytes(hex: string) {
  const clean = hex.trim().replace(/^0x/, "");
  if (!/^[0-9a-fA-F]{64}$/.test(clean)) throw new Error("A public key is 64 hex characters (32 bytes).");
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function base64ToBytes(b64: string) {
  const bin = atob(b64.trim());
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function verify(text: string, trustedKey: string): Promise<Result> {
  let parsed: { payload?: unknown; signature?: string; public_key?: string };
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: "That is not valid JSON." };
  }
  if (!parsed || typeof parsed !== "object" || !parsed.payload || typeof parsed.signature !== "string") {
    return { ok: false, reason: 'Expected { "payload": { … }, "signature": "<base64>", "public_key": "<hex>" }.' };
  }
  const keyHex = trustedKey.trim() || parsed.public_key || "";
  if (!keyHex) return { ok: false, reason: "No public key: add public_key to the receipt or enter a key you trust." };
  if (!globalThis.crypto?.subtle) return { ok: false, reason: "This browser does not expose WebCrypto here (it needs a secure https page)." };
  try {
    const keyBytes = hexToBytes(keyHex);
    const sig = base64ToBytes(parsed.signature);
    if (sig.length !== 64) return { ok: false, reason: "An Ed25519 signature is 64 bytes; this one is not." };
    const key = await crypto.subtle.importKey("raw", keyBytes, { name: "Ed25519" }, false, ["verify"]);
    const data = new TextEncoder().encode(canonical(parsed.payload));
    const good = await crypto.subtle.verify({ name: "Ed25519" }, key, sig, data);
    return good ? { ok: true, key: keyHex.replace(/^0x/, "").toLowerCase() } : { ok: false, reason: "Signature does not match this payload and key. Something was changed, or the key is different." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (/Ed25519|Unrecognized|not supported|NotSupported/i.test(msg) || (error as { name?: string })?.name === "NotSupportedError") {
      return { ok: false, reason: "This browser cannot check Ed25519 signatures yet. Current Chrome, Edge, Firefox and Safari can." };
    }
    return { ok: false, reason: msg || "The receipt could not be checked." };
  }
}

export function ReceiptChecker() {
  const [text, setText] = useState("");
  const [trusted, setTrusted] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor="receipt-json" className="mono-label text-muted">
          Receipt (JSON)
        </label>
        <button
          type="button"
          data-load-sample
          onClick={() => {
            setText(JSON.stringify(SAMPLE_RECEIPT, null, 2));
            setResult(null);
          }}
          className="border-b-2 border-signal pb-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em] hover:text-signal-deep"
        >
          Load sample
        </button>
      </div>
      <textarea
        id="receipt-json"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setResult(null);
        }}
        rows={9}
        spellCheck={false}
        placeholder='{ "payload": { … }, "signature": "…", "public_key": "…" }'
        className="field mt-2 font-mono text-[12.5px]"
      />
      <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-muted">
        The sample is a demo key and a sample receipt: a real signature over made-up values.
      </p>
      <details className="mt-4 border border-line bg-white px-4 py-3">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.08em]">Check against a key I trust instead</summary>
        <p className="mt-3 text-[14px] leading-[1.5] text-muted">
          A provider&apos;s enclave can sign receipts with its own key, which the router&apos;s list will not contain. Paste that key here (64 hex characters, the
          one its attestation quote commits to) and it is used instead of the key inside the receipt.
        </p>
        <input value={trusted} onChange={(e) => setTrusted(e.target.value)} placeholder="64 hex characters" spellCheck={false} className="field mt-3 font-mono text-[13px]" />
      </details>
      <button
        type="button"
        disabled={busy || !text.trim()}
        data-verify-receipt
        onClick={async () => {
          setBusy(true);
          setResult(await verify(text, trusted));
          setBusy(false);
        }}
        className="btn btn-cut btn-dot btn-solid-dark mt-5"
      >
        {busy ? "Checking…" : "Verify receipt"} <ArrowRight className="size-4" />
      </button>
      {result ? (
        <div
          role="status"
          data-verify-result={result.ok ? "valid" : "invalid"}
          className={`mt-5 flex items-start gap-3 border px-4 py-3.5 text-[15px] leading-[1.5] ${
            result.ok ? "border-signal-deep/40 bg-signal-tint text-signal-deep" : "border-danger/40 bg-danger-tint text-danger"
          }`}
        >
          {result.ok ? <CheckIcon className="mt-0.5 size-5 shrink-0" /> : <AlertIcon className="mt-0.5 size-5 shrink-0" />}
          <div className="min-w-0">
            <p className="font-semibold">{result.ok ? "Valid signature" : "Not verified"}</p>
            <p className="break-words font-mono text-[12px]">{result.ok ? `Signed by ed25519 key ${result.key.slice(0, 12)}…${result.key.slice(-8)}` : result.reason}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
