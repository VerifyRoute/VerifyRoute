import { NextResponse } from "next/server";
import { INVENTORY } from "@/components/trust/inventory";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(INVENTORY, { headers: { "cache-control": "public, max-age=300" } });
}
