import { ImageResponse } from "next/og";
import { BRAND } from "@/config/brand";

export const alt = `${BRAND.name} · ${BRAND.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b0c0b", color: "#f5f5f0", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <path d="M2 5h7.2l6.8 15.2L22.8 5H30L19.2 28h-6.4L2 5z" fill="#f5f5f0" />
            <path d="M15.2 5h1.6v11.2h-1.6z" fill="#f5f5f0" />
            <path d="m8.4 14.6 3.4 3.4 1.6-1.6-3.4-3.4z" fill="#1fe15a" />
          </svg>
          {BRAND.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 124, fontWeight: 800, letterSpacing: -6, lineHeight: 0.92 }}>
          <span>Know.</span>
          <span>Verify.</span>
          <span style={{ color: "#1fe15a" }}>Route.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#979d96" }}>{BRAND.tagline} · Robinhood Chain</div>
      </div>
    ),
    size,
  );
}
