import type { Metadata } from "next";
import { Arena } from "@/components/playground/Arena";

export const metadata: Metadata = {
  title: "Arena",
  description: "Race one prompt across two to four models and compare first token, total time, tokens and estimated cost side by side.",
};

export default function ArenaPage() {
  return <Arena />;
}
