"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DARK_HEADER, NAV } from "@/config/nav";
import { BRAND } from "@/config/brand";
import { Logo, Mark } from "@/components/Logo";
import { NavCaPill } from "@/components/CopyCa";
import { NavWallet, useWalletModal } from "@/components/wallet/WalletButton";
import { useWallet } from "@/components/wallet/WalletProvider";
import { ArrowRight, CloseIcon, MenuIcon } from "@/components/icons";

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    // The home hero is dark and the page below it is paper: the header
    // follows, switching once the hero has scrolled away.
    const onScroll = () => setScrolled(window.scrollY > 760);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const dark = DARK_HEADER.includes(pathname) && !(pathname === "/" && scrolled);
  const tone = dark ? "dark" : "light";
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    // Close the mobile menu on navigation, derived during render.
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      <header
        className={`sticky top-0 z-50 h-[var(--header)] border-b backdrop-blur-md transition-colors duration-300 ${
          dark ? `border-line-dark ${pathname === "/console" ? "bg-ink" : "bg-ink/70"} text-paper` : "border-line bg-paper/85 text-ink"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1520px] items-center gap-3 px-4 sm:px-6 lg:px-10">
          <Link href="/" aria-label={`${BRAND.name} home`} className="flex shrink-0 items-center">
            <span className="sm:hidden">
              <Mark size={28} />
            </span>
            <span className="hidden sm:inline-flex">
              <Logo />
            </span>
          </Link>

          <nav aria-label="Main" className="ml-8 hidden min-w-0 items-center gap-6 xl:flex 2xl:ml-10 2xl:gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap py-1.5 text-[14px] font-medium transition-opacity hover:opacity-100 ${
                  isActive(item.href) ? "opacity-100" : "opacity-80"
                }`}
              >
                {item.label}
                {isActive(item.href) ? <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-signal" /> : null}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-2.5">
            <NavCaPill tone={tone} />
            <span className="hidden sm:inline-flex">
              <NavWallet tone={tone} />
            </span>
            <span className="inline-flex sm:hidden">
              <NavWallet tone={tone} compact />
            </span>
            <Link
              href="/docs"
              className={`btn btn-sm hidden 2xl:inline-flex ${dark ? "btn-outline-light" : "btn-outline-dark"}`}
            >
              API docs <ArrowRight className="size-3.5" />
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={`grid size-[38px] shrink-0 place-items-center border xl:hidden ${dark ? "border-line-dark-strong" : "border-line-strong"}`}
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </header>
      {open ? <MobileMenu onClose={() => setOpen(false)} isActive={isActive} /> : null}
    </>
  );
}

function MobileMenu({ onClose, isActive }: { onClose: () => void; isActive: (href: string) => boolean }) {
  const { address } = useWallet();
  const { open } = useWalletModal();
  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--header)] z-40 animate-fade overflow-y-auto bg-ink text-paper xl:hidden">
      <nav aria-label="Mobile" className="flex flex-col px-4 pb-10 pt-4 sm:px-6">
        {NAV.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-baseline gap-4 border-b border-line-dark py-4 text-[26px] font-[640] tracking-[-0.03em]"
          >
            <span className="w-7 font-mono text-[11px] font-normal tracking-normal text-muted-dark">{String(i + 1).padStart(2, "0")}</span>
            <span className={isActive(item.href) ? "text-signal" : ""}>{item.label}</span>
          </Link>
        ))}
        <div className="mt-8 grid gap-3">
          {address ? (
            <Link href="/dashboard" onClick={onClose} className="btn btn-cut btn-dot btn-solid-light">
              Open dashboard <ArrowRight className="size-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                open();
              }}
              className="btn btn-cut btn-dot btn-solid-light"
            >
              Connect wallet <ArrowRight className="size-4" />
            </button>
          )}
          <Link href="/docs" onClick={onClose} className="btn btn-outline-light">
            API docs <ArrowRight className="size-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
