import type { Metadata } from "next";
import { PageBody, PageHero } from "@/components/ui/page";
import { AskFiles } from "@/components/playground/AskFiles";

export const metadata: Metadata = {
  title: "Ask your files",
  description: "Add text files, ask a question and get an answer that cites the passages it used. Files are read in your browser.",
};

const HANDLING: [string, string][] = [
  [
    "Read in this tab.",
    "Files are opened by your browser and turned into plain text. This page reads .txt, .md, .csv, .json and .html today; PDF and Word files are not supported yet. File names never leave the page: passages are sent as doc-1, doc-2 and so on.",
  ],
  [
    "Ranked in this tab.",
    "The text is cut into overlapping passages and ranked against your question by word overlap, right here. Only the best few passages leave the browser, never the whole file.",
  ],
  [
    "Sent to one model.",
    "Your question and the chosen passages go over TLS to the router, which forwards them to the chat model you picked on the standard lane. That provider's published data policy applies. Attested private lanes are not live yet.",
  ],
  [
    "Nothing kept here.",
    "The files, the passages and the answer live in this tab's memory and are gone when you reload or press Clear. Nothing is written to browser storage, and the router stores no text.",
  ],
];

export default function AskPage() {
  return (
    <>
      <PageHero
        eyebrow="Ask / your files"
        title={
          <>
            Ask your
            <br />
            files.
          </>
        }
        lede="Add documents, ask a question, and get an answer that points to the passages it used. Your files are read in this browser; only the best passages travel with your question."
      />
      <PageBody>
        <section className="border border-line-strong bg-white px-5 py-8 sm:px-8">
          <h2 className="text-[clamp(24px,2.4vw,30px)] font-[640] tracking-[-0.04em]">How your files are handled</h2>
          <ol className="mt-6 grid max-w-[820px] gap-4">
            {HANDLING.map(([t, b], i) => (
              <li key={t} className="flex gap-4 text-[15.5px] leading-[1.55]">
                <span className="grid size-[22px] shrink-0 place-items-center bg-ink font-mono text-[11px] text-paper">{i + 1}</span>
                <span>
                  <b className="font-semibold">{t}</b> <span className="text-muted">{b}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[14px] text-muted">
            The relay is <code className="bg-paper-3 px-1.5 py-0.5 font-mono text-[12.5px]">POST /api/chat</code>. Receipts for these calls arrive with the router
            (preview).
          </p>
        </section>
        <AskFiles />
      </PageBody>
    </>
  );
}
