import type { Metadata } from "next";
import { Console } from "@/components/playground/Console";

export const metadata: Metadata = {
  title: "Console",
  description: "Every model on one page: pick a model, type, and see the time, tokens and estimated cost of each reply.",
};

export default function ConsolePage() {
  return <Console />;
}
