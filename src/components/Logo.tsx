import { BRAND } from "@/config/brand";

/**
 * The owner's VerifyRoute mark (public/brand/mark.webp), drawn as a mask so it
 * takes the text colour it sits in: light on dark surfaces, ink on light ones.
 */
export function Mark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: "url(/brand/mark.webp)",
        maskImage: "url(/brand/mark.webp)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function Logo({ className = "", size = 26 }: { className?: string; size?: number }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark size={size} />
      <span className="text-[19px] font-[640] leading-none tracking-[-0.03em]" aria-label={BRAND.name}>VerifyRoute</span>
    </span>
  );
}
