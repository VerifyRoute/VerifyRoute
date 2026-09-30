import { NextResponse } from "next/server";
import { BRAND } from "@/config/brand";

export const dynamic = "force-static";

/** OpenAPI 3.1 description of the /api/v1 design. The API itself is a design preview. */
export function GET() {
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const doc = {
    openapi: "3.1.0",
    info: {
      title: `${BRAND.name} API`,
      version: "0.1.0",
      description: `Design preview. The ${BRAND.name} inference API: one key and one USDG balance for many models, with a signed receipt on every call. Endpoints below are not live yet.`,
    },
    servers: [{ url: `${BRAND.url}/api/v1` }],
    security: [{ bearer: [] }],
    paths: {
      "/chat/completions": {
        post: {
          summary: "Create a chat completion",
          operationId: "createChatCompletion",
          requestBody: { required: true, content: { "application/json": { schema: ref("ChatRequest") } } },
          responses: {
            "200": { description: "Completion with usage and receipt", content: { "application/json": { schema: ref("ChatResponse") } } },
            "402": { description: "Payment required: body carries a USDG price for a keyless call" },
            "409": { description: "No provider meets the requested verification floor" },
            "503": { description: "No attested endpoint for the requested lane" },
          },
        },
      },
      "/models": {
        get: {
          summary: "List models",
          operationId: "listModels",
          security: [],
          responses: { "200": { description: "Model catalog", content: { "application/json": { schema: { type: "object", properties: { data: { type: "array", items: ref("Model") } } } } } } },
        },
      },
      "/keys": {
        post: {
          summary: "Create an API key for the connected wallet",
          operationId: "createKey",
          requestBody: { required: true, content: { "application/json": { schema: ref("KeyPolicy") } } },
          responses: { "201": { description: "Key created; the secret is shown once" } },
        },
        get: { summary: "List keys", operationId: "listKeys", responses: { "200": { description: "Keys without secrets" } } },
      },
      "/receipts/{id}": {
        get: {
          summary: "Fetch a signed receipt",
          operationId: "getReceipt",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Receipt", content: { "application/json": { schema: ref("Receipt") } } }, "404": { description: "Unknown receipt" } },
        },
      },
    },
    components: {
      securitySchemes: { bearer: { type: "http", scheme: "bearer", description: "Key of the form vr-live-…" } },
      schemas: {
        Message: { type: "object", required: ["role", "content"], properties: { role: { type: "string" }, content: { type: "string" } } },
        ChatRequest: {
          type: "object",
          required: ["model", "messages"],
          properties: {
            model: { type: "string", examples: ["meta-llama/llama-3.3-70b-instruct"] },
            messages: { type: "array", items: ref("Message") },
            stream: { type: "boolean" },
            provider: { type: "object", properties: { order: { type: "array", items: { type: "string" } }, sort: { type: "string", enum: ["price", "latency", "throughput"] }, allow_fallbacks: { type: "boolean" } } },
            verify: { type: "object", properties: { bond_min: { type: "number" }, canary_min: { type: "number" }, require_receipt: { type: "boolean" } } },
          },
        },
        ChatResponse: {
          type: "object",
          properties: {
            id: { type: "string" },
            model: { type: "string" },
            choices: { type: "array", items: { type: "object" } },
            usage: { type: "object", properties: { prompt_tokens: { type: "integer" }, completion_tokens: { type: "integer" }, cost: { type: "string", description: "USDG" } } },
            receipt: ref("Receipt"),
          },
        },
        Model: { type: "object", properties: { id: { type: "string" }, name: { type: "string" }, context_length: { type: "integer" }, pricing: { type: "object" } } },
        KeyPolicy: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            limit: { type: ["number", "null"] },
            limit_reset: { type: ["string", "null"], enum: ["daily", "weekly", "monthly", null] },
            allowed_models: { type: ["array", "null"], items: { type: "string" } },
            lane: { type: "string", enum: ["standard", "attested", "blind"] },
          },
        },
        Receipt: {
          type: "object",
          properties: {
            id: { type: "string" },
            model: { type: "string" },
            provider: { type: "string" },
            lane: { type: "string" },
            cost_usdg: { type: "string" },
            request_sha256: { type: "string" },
            response_sha256: { type: "string" },
            attestation_sha256: { type: ["string", "null"] },
            issued_at: { type: "string", format: "date-time" },
            key_id: { type: "string" },
            sig: { type: "string", description: "Ed25519 signature" },
          },
        },
      },
    },
  };
  return NextResponse.json(doc);
}
