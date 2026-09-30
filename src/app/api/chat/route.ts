import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/*
 * Chat relay for the console, the arena and ask-your-files. It streams from
 * OpenRouter's chat completions endpoint with the operator's key, which lives
 * only in the server environment (OPENROUTER_API_KEY). Without it the route
 * answers 503 "not_configured" and the pages show a calm notice.
 */

const UPSTREAM = "https://openrouter.ai/api/v1/chat/completions";
const MAX_MESSAGES = 40;
const MAX_CHARS = 60_000;
const MAX_TOKENS = 2048;
const WINDOW_MS = 60_000;
const PER_WINDOW = 20;

const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, list] of hits) if (!list.some((t) => now - t < WINDOW_MS)) hits.delete(key);
  }
  return recent.length > PER_WINDOW;
}

const configured = () => Boolean(process.env.OPENROUTER_API_KEY);

export async function GET() {
  return NextResponse.json({ configured: configured() }, { headers: { "cache-control": "no-store" } });
}

type Message = { role: string; content: string };

export async function POST(request: Request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited", message: "Too many requests. Wait a minute and try again." }, { status: 429 });

  let body: { model?: unknown; messages?: unknown; max_tokens?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Invalid JSON." }, { status: 400 });
  }

  const model = typeof body.model === "string" ? body.model.trim() : "";
  if (!model || model.length > 120 || !/^[\w.\-/:]+$/.test(model)) {
    return NextResponse.json({ error: "bad_request", message: "Choose a model." }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "bad_request", message: `Send between 1 and ${MAX_MESSAGES} messages.` }, { status: 400 });
  }
  const messages: Message[] = [];
  let chars = 0;
  for (const raw of body.messages as unknown[]) {
    const m = raw as Partial<Message>;
    if (!m || !["system", "user", "assistant"].includes(String(m.role)) || typeof m.content !== "string") {
      return NextResponse.json({ error: "bad_request", message: "Each message needs a role and text content." }, { status: 400 });
    }
    chars += m.content.length;
    messages.push({ role: m.role as string, content: m.content });
  }
  if (chars > MAX_CHARS) return NextResponse.json({ error: "too_large", message: "The conversation is too long for one request." }, { status: 413 });

  const requested = Number(body.max_tokens);
  const maxTokens = Number.isFinite(requested) && requested > 0 ? Math.min(Math.floor(requested), MAX_TOKENS) : 1024;

  let upstream: Response;
  try {
    upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        "HTTP-Referer": "https://verifyroute.tech",
        "X-Title": "Verify Route",
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, stream: true, usage: { include: true } }),
      signal: AbortSignal.timeout(120_000),
    });
  } catch {
    return NextResponse.json({ error: "upstream_unreachable", message: "The model provider could not be reached." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    let message = `The provider answered ${upstream.status}.`;
    try {
      const err = (await upstream.json()) as { error?: { message?: string } };
      if (err?.error?.message) message = err.error.message.slice(0, 300);
    } catch {
      // Keep the status-only message.
    }
    return NextResponse.json({ error: "upstream_error", message }, { status: upstream.status === 429 ? 429 : 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}
