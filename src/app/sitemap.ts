import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

const ROUTES = [
  "",
  "/models",
  "/console",
  "/ask",
  "/arena",
  "/docs",
  "/veil",
  "/spec",
  "/spec/0001-attestation",
  "/spec/0002-transport",
  "/spec/0003-credits",
  "/spec/0004-receipts",
  "/spec/0005-policy",
  "/spec/changelog",
  "/credits",
  "/case-study",
  "/dashboard",
  "/providers",
  "/registry",
  "/status",
  "/verify",
  "/tlog/checkpoint",
  "/retention",
  "/legal/privacy",
  "/legal/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({ url: `${BRAND.url}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.6 }));
}
