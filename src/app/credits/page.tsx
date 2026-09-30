import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { ArrowRight } from "@/components/icons";
import { ArrowLink, PageBody, PageHero, PreviewTag } from "@/components/ui/page";
import { ConnectButton } from "@/components/wallet/WalletButton";

export const metadata: Metadata = {
  title: "Blind credits",
  description: "Pay from your wallet and hold blind credits on your device: what stays linkable to you and what does not.",
};

const STEPS = ["One-time key", "Pay", "Credit", "Mint credits", "Keep them", "Wipe the key"];

const LINKABLE = [
  ["The payment.", "Sending USDG is a public transfer on Robinhood Chain. Anyone, the router included, can see that your wallet paid, how much, and to which one-time key."],
  ["The purchase.", "The router records that the one-time key bought credits: how many and in which sizes. Put together, “this wallet bought N credits” is on record."],
  ["Your network address and timing.", "Buying over the open internet shows the router your IP address, and spending right after buying links the two by time. Waiting and using an onion route both help."],
];

const NOT_LINKABLE = [
  ["Which prompts the credits paid for.", "The router signs each credit blind: it never sees the credit it signs. When one is spent, the router can tell it is genuine and unspent, but not which purchase or wallet it came from. The call is logged against a hash of the credit, with no key, account or wallet, and its receipt says the same."],
];

const LIMITS = [
  ["The text of a request.", "On every lane the router reads a request in memory to route it, and that includes calls paid with credits. Credits hide who pays, not what is sent."],
  ["Your address while spending, unless you use Tor.", "Spend credits through an onion address to keep your network address from the router. Calls on one circuit can be linked to each other."],
  ["Unused value.", "A credit pays for one call up to its value; the rest is not returned. Credits expire on the date shown with them, and a lost credit cannot be replaced, because nobody keeps a record of who holds them."],
];

function List({ items }: { items: string[][] }) {
  return (
    <ul className="mt-4 grid gap-4">
      {items.map(([t, b]) => (
        <li key={t} className="flex gap-3 text-[15.5px] leading-[1.6] text-muted">
          <span className="mt-2.5 size-1.5 shrink-0 bg-signal-deep" />
          <span>
            <b className="font-semibold text-ink">{t}</b> {b}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function CreditsPage() {
  return (
    <>
      <PageHero
        eyebrow="Blind credits / from your wallet"
        title={
          <>
            Blind credits,
            <br />
            kept on your device.
          </>
        }
        lede="Pay from your own wallet and end up holding blind credits in this browser. No account and no long-lived key: a one-time key is made here, receives your payment, buys the credits and is wiped. Below is a plain account of what stays linkable to you and what does not."
      />
      <PageBody>
        <div className="max-w-[1040px]">
          <div className="flex flex-wrap items-center gap-3">
            <PreviewTag>Preview · the credit issuer is not live</PreviewTag>
            <span className="text-[14px] text-muted">The flow below is the design. No payment can be made on this page yet.</span>
          </div>
          <ol className="mt-6 grid grid-cols-2 border-l border-t border-line bg-white sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((s, i) => (
              <li key={s} className={`relative border-b border-r border-line px-3 py-4 ${i === 0 ? "" : ""}`}>
                {i === 0 ? <span className="absolute inset-x-0 top-0 h-[3px] bg-signal-deep" /> : null}
                <span className={`inline-grid size-6 place-items-center border font-mono text-[11px] ${i === 0 ? "border-ink bg-ink text-paper" : "border-ink"}`}>{i + 1}</span>
                <p className={`mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.08em] ${i === 0 ? "" : "text-muted"}`}>{s}</p>
              </li>
            ))}
          </ol>

          <section className="mt-8 border border-line bg-white p-6 sm:p-8">
            <h2 className="text-[clamp(24px,2.6vw,32px)] font-[640] tracking-[-0.04em]">1 · Make a one-time key and choose how to pay</h2>
            <p className="mt-3 max-w-[760px] text-[15.5px] leading-[1.6] text-muted">
              The key is made in this tab, needs no account and never leaves it. It receives your payment, the page turns the credit into blind credits, and then the
              key is switched off and wiped.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="border border-ink border-l-[3px] border-l-signal-deep p-5">
                <p className="flex items-center gap-2.5 text-[18px] font-semibold">
                  <span className="grid size-4 place-items-center rounded-full border border-signal-deep">
                    <span className="size-2 rounded-full bg-signal-deep" />
                  </span>
                  USDG
                </p>
                <p className="mt-2 text-[14.5px] leading-[1.55] text-muted">USDG on Robinhood Chain is credited one for one, with no haircut, then turned into credits of the same value.</p>
              </div>
              <div className="border border-line p-5 opacity-60">
                <p className="flex items-center gap-2.5 text-[18px] font-semibold">
                  <span className="size-4 rounded-full border border-ink" />
                  {BRAND.symbol}
                </p>
                <p className="mt-2 text-[14.5px] leading-[1.55] text-muted">Paying in {BRAND.symbol} is considered for after the token launch. Not available.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled className="btn btn-cut btn-dot btn-solid-dark">
                Create the one-time key <ArrowRight className="size-4" />
              </button>
              <ConnectButton className="btn btn-outline-dark">
                Connect wallet <ArrowRight className="size-4" />
              </ConnectButton>
            </div>
          </section>

          <section className="mt-6 border border-line bg-white p-6 sm:p-8">
            <h2 className="text-[clamp(24px,2.6vw,32px)] font-[640] tracking-[-0.04em]">Your credits</h2>
            <p className="mt-3 text-[15.5px] text-muted">None yet. Credits bought here stay in this browser and can be saved to a file you keep.</p>
          </section>

          <section className="mt-20">
            <h2 className="h-section">What is linkable, and what is not</h2>
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-[22px] font-[640] tracking-[-0.03em]">Can be linked to you</h3>
                <List items={LINKABLE} />
              </div>
              <div>
                <h3 className="text-[22px] font-[640] tracking-[-0.03em]">Cannot be linked to you</h3>
                <List items={NOT_LINKABLE} />
                <h3 className="mt-10 text-[22px] font-[640] tracking-[-0.03em]">What credits do not hide</h3>
                <List items={LIMITS} />
              </div>
            </div>
          </section>

          <section className="mt-20 border-t border-line pt-10">
            <h2 className="text-[clamp(28px,3vw,38px)] font-[640] tracking-[-0.04em]">Spending them</h2>
            <p className="mt-4 max-w-[720px] text-[16px] leading-[1.6] text-muted">
              The unlinkable lane is not served yet, so credits cannot be spent anywhere today. When it opens, a credit goes in the{" "}
              <code className="bg-paper-3 px-1.5 font-mono text-[0.85em]">Authorization</code> header as{" "}
              <code className="bg-paper-3 px-1.5 font-mono text-[0.85em]">BlindCredit credit=&lt;credit&gt;</code>, with the lane named in{" "}
              <code className="bg-paper-3 px-1.5 font-mono text-[0.85em]">X-VR-Lane: unlinkable</code>.
            </p>
            <ArrowLink href="/spec/0003-credits" className="mt-6">
              Read the credits spec
            </ArrowLink>
          </section>
        </div>
      </PageBody>
    </>
  );
}
