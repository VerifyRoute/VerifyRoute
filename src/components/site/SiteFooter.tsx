import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";
import { FOOTER } from "@/config/nav";
import { Logo } from "@/components/Logo";
import { CaBlock } from "@/components/CopyCa";
import { ArrowRight } from "@/components/icons";
import { ConnectButton } from "@/components/wallet/WalletButton";
import { ProofBars } from "@/components/site/ProofBars";

export function SiteFooter() {
  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-paper">
      <ProofBars className="pointer-events-none absolute right-0 top-0 h-[300px] w-[62%] sm:h-[460px]" />
      <div className="wrap relative pb-24 pt-40 sm:pt-[256px] lg:pb-32">
        <p className="eyebrow">Start routing</p>
        <h2 className="mt-6 max-w-[1000px] text-[clamp(56px,9vw,130px)] font-[660] leading-[0.88] tracking-[-0.058em]">
          Route with <span className="text-signal">proof</span>.
        </h2>
        <p className="lede mt-8 max-w-[440px] text-muted-dark">
          One key, one USDG balance and a signed receipt on every call. Swap the base URL, keep the SDK you already use.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ConnectButton className="btn btn-cut btn-dot btn-solid-light">
            Connect wallet <ArrowRight className="size-4" />
          </ConnectButton>
          <Link href="/docs" className="btn btn-outline-light">
            Read the docs <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="wrap grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:py-20">
          <div>
            <Logo />
            <p className="mt-5 max-w-[290px] text-[14px] leading-[1.55] text-muted-dark">
              {BRAND.tagline} on {CHAIN.name}. Know the model, verify the provider, route the call.
            </p>
            <div className="mt-8">
              <CaBlock />
            </div>
          </div>
          {FOOTER.map((col) => (
            <div key={col.title}>
              <h4 className="mono-label text-muted-dark">{col.title}</h4>
              <ul className="mt-5 grid gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[15px] text-paper/90 transition-colors hover:text-signal">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="wrap flex flex-col gap-3 py-6 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-dark md:flex-row md:items-center md:justify-between">
          <span>Settled in USDG on {CHAIN.name} · chain {CHAIN.id}</span>
          <span>Receipts: Ed25519 · anchored hourly (design)</span>
          <span>
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.slogan}
          </span>
        </div>
      </div>
    </footer>
  );
}
