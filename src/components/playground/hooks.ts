"use client";

import { useEffect, useState } from "react";
import type { Model } from "@/lib/models";

export type CatalogState = { status: "loading" | "ready" | "error"; models: Model[]; makers: number };

let catalogPromise: Promise<CatalogState> | null = null;

function loadCatalog(): Promise<CatalogState> {
  catalogPromise ??= fetch("/api/models")
    .then(async (res) => {
      if (!res.ok) throw new Error("catalog");
      const body = (await res.json()) as { models: Model[]; makers: number };
      return { status: "ready" as const, models: body.models, makers: body.makers };
    })
    .catch(() => {
      catalogPromise = null; // a failure is not remembered: the next mount retries
      return { status: "error" as const, models: [], makers: 0 };
    });
  return catalogPromise;
}

/** The live catalog, fetched once per page load and shared by every picker. */
export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: "loading", models: [], makers: 0 });
  useEffect(() => {
    let alive = true;
    loadCatalog().then((s) => alive && setState(s));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/** Whether the server has a chat key configured; null while asking. */
export function useChatConfigured(): boolean | null {
  const [configured, setConfigured] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/chat", { cache: "no-store" })
      .then((r) => r.json())
      .then((b: { configured?: boolean }) => alive && setConfigured(Boolean(b.configured)))
      .catch(() => alive && setConfigured(false));
    return () => {
      alive = false;
    };
  }, []);
  return configured;
}

/** First id from `wanted` that exists in the catalog, else the first model. */
export function pickDefault(models: Model[], wanted: string[]): string {
  for (const id of wanted) if (models.some((m) => m.id === id)) return id;
  return models[0]?.id ?? "";
}
