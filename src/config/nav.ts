// Site navigation. Paths are the only place a route name is written down.

export const NAV = [
  { href: "/models", label: "Models" },
  { href: "/console", label: "Console" },
  { href: "/ask", label: "Ask files" },
  { href: "/arena", label: "Arena" },
  { href: "/docs", label: "Docs" },
  { href: "/veil", label: "VEIL" },
  { href: "/credits", label: "Blind credits" },
  { href: "/case-study", label: "Case study" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#about", label: "About" },
] as const;

export const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/models", label: "Models" },
      { href: "/console", label: "Console" },
      { href: "/ask", label: "Ask your files" },
      { href: "/arena", label: "Arena" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard#playground", label: "Playground" },
      { href: "/case-study", label: "Case study" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "API docs" },
      { href: "/docs#sdk", label: "SDKs" },
      { href: "/verify", label: "Verify a provider" },
      { href: "/veil", label: "VEIL privacy protocol" },
      { href: "/credits", label: "Blind credits" },
      { href: "/spec", label: "VEIL spec" },
      { href: "/registry", label: "Registry" },
      { href: "/docs#badge", label: "Badge" },
      { href: "/status", label: "Proof-time" },
      { href: "/providers", label: "Providers" },
      { href: "/#developers", label: "Quickstart" },
      { href: "/#routes", label: "Route types" },
      { href: "/#flow", label: "The Flow" },
    ],
  },
  {
    title: "Verify Route",
    links: [
      { href: "/#about", label: "About" },
      { href: "/#roadmap", label: "Roadmap" },
      { href: "/#privacy", label: "Privacy route" },
      { href: "/legal/privacy", label: "Data notice" },
      { href: "/retention", label: "What we keep" },
      { href: "/legal/terms", label: "Terms" },
    ],
  },
] as const;

/** Routes whose top of page is dark, so the header renders on ink. */
export const DARK_HEADER = ["/", "/arena", "/console"];
