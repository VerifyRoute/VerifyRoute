import { BRAND } from "@/config/brand";

/**
 * The Verify Route mark: two route arms that meet at one verified point.
 * The left arm carries the green check stroke, the right arm is split by
 * the route line that runs through the router.
 */
export function Mark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M2 5h7.2l6.8 15.2L22.8 5H30L19.2 28h-6.4L2 5z" fill="currentColor" />
      <path d="M15.2 5h1.6v11.2h-1.6z" fill="currentColor" />
      <path d="m8.4 14.6 3.4 3.4 1.6-1.6-3.4-3.4z" fill="#1fe15a" />
      <path d="M15.4 2.2h1.2v2h-1.2z" fill="#1fe15a" />
    </svg>
  );
}

export function Logo({ className = "", size = 26 }: { className?: string; size?: number }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark size={size} />
      <span className="text-[19px] font-[640] leading-none tracking-[-0.04em]">{BRAND.name}</span>
    </span>
  );
}
