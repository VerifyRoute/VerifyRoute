"use client";

import type { Model } from "@/lib/models";

/* Browser side of the chat relay: stream one completion through /api/chat and
   measure what the caller sees (first token, total time, token usage). */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatResult = {
  text: string;
  firstTokenMs: number | null;
  totalMs: number;
  promptTokens: number | null;
  completionTokens: number | null;
  /** Cost reported by the upstream, in USD, when it sends one. */
  reportedCost: number | null;
};

export class ChatError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function streamChat(opts: {
  model: string;
  messages: ChatMessage[];
  maxTokens?: number;
  signal?: AbortSignal;
  onText?: (full: string) => void;
}): Promise<ChatResult> {
  const started = performance.now();
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: opts.model, messages: opts.messages, max_tokens: opts.maxTokens ?? 1024 }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) {
    let code = "error";
    let message = `Request failed (${res.status}).`;
    try {
      const body = (await res.json()) as { error?: string; message?: string };
      code = body.error ?? code;
      if (body.message) message = body.message;
      if (code === "not_configured") message = "Live chat is not configured on this deployment yet.";
    } catch {
      // Keep the generic message.
    }
    throw new ChatError(code, message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let firstTokenMs: number | null = null;
  let promptTokens: number | null = null;
  let completionTokens: number | null = null;
  let reportedCost: number | null = null;

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let cut: number;
    while ((cut = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, cut).trim();
      buffer = buffer.slice(cut + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const chunk = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
          usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number };
          error?: { message?: string };
        };
        if (chunk.error?.message) throw new ChatError("upstream_error", chunk.error.message);
        const piece = chunk.choices?.[0]?.delta?.content;
        if (piece) {
          if (firstTokenMs === null) firstTokenMs = performance.now() - started;
          text += piece;
          opts.onText?.(text);
        }
        if (chunk.usage) {
          promptTokens = chunk.usage.prompt_tokens ?? promptTokens;
          completionTokens = chunk.usage.completion_tokens ?? completionTokens;
          if (typeof chunk.usage.cost === "number") reportedCost = chunk.usage.cost;
        }
      } catch (error) {
        if (error instanceof ChatError) throw error;
        // Partial or keep-alive line; skip it.
      }
    }
  }
  return { text, firstTokenMs, totalMs: performance.now() - started, promptTokens, completionTokens, reportedCost };
}

/** Cost estimate in USD from catalog list prices (per 1M tokens). */
export function estimateCost(model: Model | undefined, result: Pick<ChatResult, "promptTokens" | "completionTokens" | "text">, promptChars: number) {
  if (!model || model.input === null || model.output === null) return null;
  const inTok = result.promptTokens ?? Math.ceil(promptChars / 4);
  const outTok = result.completionTokens ?? Math.ceil(result.text.length / 4);
  return (inTok * model.input + outTok * model.output) / 1_000_000;
}

export function formatMs(ms: number | null) {
  if (ms === null) return "—";
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
}

export function formatUsd(v: number | null) {
  if (v === null) return "—";
  if (v === 0) return "$0";
  if (v < 0.0001) return `$${v.toFixed(7)}`;
  return `$${v.toFixed(5)}`;
}

export const DEFAULT_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "qwen/qwen3-32b",
  "deepseek/deepseek-r1",
  "mistralai/mistral-small-3.2-24b-instruct",
];
