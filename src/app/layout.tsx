import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/config/brand";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { WalletModalProvider } from "@/components/wallet/WalletButton";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const grotesk = Host_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin"], variable: "--font-martian", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} · ${BRAND.slogan}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: {
    title: `${BRAND.name} · ${BRAND.slogan}`,
    description: BRAND.tagline,
    url: BRAND.url,
    siteName: BRAND.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", site: BRAND.xHandle, title: `${BRAND.name} · ${BRAND.slogan}`, description: BRAND.tagline },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${martian.variable}`}>
      <body>
        <WalletProvider>
          <WalletModalProvider>
            <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[90] focus:bg-signal focus:px-3 focus:py-2 focus:text-ink">
              Skip to content
            </a>
            <SiteHeader />
            <main id="content">{children}</main>
            <SiteFooter />
          </WalletModalProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
