import type { Metadata } from "next";
import { BRAND, CHAIN } from "@/config/brand";
import { Workspace } from "@/components/app/Workspace";

export const metadata: Metadata = {
  title: "Workspace",
  description: `Your ${BRAND.name} workspace: sign in with a wallet on ${CHAIN.name}.`,
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 pb-28 pt-12 sm:px-6 lg:px-10 lg:pt-[52px]">
      <p className="mono-label text-muted">{BRAND.name} workspace</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-[clamp(40px,4.6vw,56px)] font-[660] leading-[0.95] tracking-[-0.055em]">Every route, on the record.</h1>
        <span className="chip chip-solid w-fit">
          <i className="size-1.5 bg-signal" /> Live · chain {CHAIN.id}
        </span>
      </div>
      <div className="mt-6">
        <Workspace />
      </div>
    </div>
  );
}
