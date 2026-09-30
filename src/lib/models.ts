import "server-only";

/* Live model catalog, read from the public OpenRouter models endpoint (no key).
   A good answer is kept for an hour; a failed read is never cached, so the
   next request tries again. */

const SOURCE = "https://openrouter.ai/api/v1/models";
const TTL_MS = 60 * 60 * 1000;

export type Model = {
  id: string;
  name: string;
  maker: string;
  description: string;
  context: number;
  /** USD per 1M tokens; null when the source lists no price. */
  input: number | null;
  output: number | null;
  created: number;
  modalities: string[];
  outputs: string[];
  tools: boolean;
  reasoning: boolean;
  free: boolean;
};

export type Catalog = { ok: boolean; models: Model[]; makers: number; readAt: string | null; source: string };

type Raw = {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  created?: number;
  pricing?: { prompt?: string; completion?: string };
  architecture?: { input_modalities?: string[]; output_modalities?: string[] };
  supported_parameters?: string[];
};

let cached: { at: number; catalog: Catalog } | null = null;

const perMillion = (v?: string) => {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return n * 1_000_000;
};

function clean(raw: Raw): Model | null {
  if (!raw?.id || raw.id.includes("~")) return null;
  const maker = raw.id.split("/")[0] ?? "unknown";
  const name = (raw.name ?? raw.id).replace(/^[^:]+:\s*/, "");
  const input = perMillion(raw.pricing?.prompt);
  const output = perMillion(raw.pricing?.completion);
  const params = raw.supported_parameters ?? [];
  return {
    id: raw.id,
    name,
    maker,
    description: (raw.description ?? "").replace(/\s+/g, " ").trim(),
    context: raw.context_length ?? 0,
    input,
    output,
    created: raw.created ?? 0,
    modalities: raw.architecture?.input_modalities ?? ["text"],
    outputs: raw.architecture?.output_modalities ?? ["text"],
    tools: params.includes("tools"),
    reasoning: params.includes("reasoning") || params.includes("include_reasoning"),
    free: input === 0 && output === 0,
  };
}

export async function getCatalog(): Promise<Catalog> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.catalog;
  try {
    const res = await fetch(SOURCE, { cache: "no-store", signal: AbortSignal.timeout(10_000), headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`catalog ${res.status}`);
    const body = (await res.json()) as { data?: Raw[] };
    const models = (body.data ?? []).map(clean).filter((m): m is Model => m !== null && m.input !== null && m.input >= 0);
    // Negative sentinel prices mark router-only pseudo models; they were dropped above.
    if (models.length === 0) throw new Error("empty catalog");
    const catalog: Catalog = {
      ok: true,
      models,
      makers: new Set(models.map((m) => m.maker)).size,
      readAt: new Date().toISOString(),
      source: SOURCE,
    };
    cached = { at: Date.now(), catalog };
    return catalog;
  } catch {
    // Serve the last good copy if there is one, but do not store the failure.
    if (cached) return cached.catalog;
    return { ok: false, models: [], makers: 0, readAt: null, source: SOURCE };
  }
}

export function formatPrice(v: number | null) {
  if (v === null) return "—";
  if (v === 0) return "free";
  if (v < 0.01) return `$${v.toFixed(4)}`;
  if (v < 1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(2)}`;
}

export function formatContext(n: number) {
  if (!n) return "—";
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M`;
  return `${Math.round(n / 1000)}K`;
}
