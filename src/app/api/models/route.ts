import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/models";

export const dynamic = "force-dynamic";

/** Cleaned live catalog for the client pages. A failed read is never cached. */
export async function GET() {
  const catalog = await getCatalog();
  if (!catalog.ok) {
    return NextResponse.json(
      { ok: false, error: "The live model catalog could not be reached. Try again in a moment.", models: [] },
      { status: 502, headers: { "cache-control": "no-store" } },
    );
  }
  return NextResponse.json(catalog, { headers: { "cache-control": "public, max-age=300" } });
}
