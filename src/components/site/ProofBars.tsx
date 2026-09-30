/**
 * A falling curtain of receipt bars: each bar is one routed call, its length
 * the latency, and the green ones the calls whose proof checked out.
 * Deterministic, so server and client render the same picture.
 */
function makeBars(count: number) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: count }, (_, i) => {
    const t = i / count;
    // Density and length grow toward the right edge.
    const reach = Math.pow(t, 1.6);
    const height = Math.max(0.02, reach * (0.35 + rand() * 0.65));
    const green = rand() > 0.93;
    return { x: t * 1000, h: height * 1000, green, o: 0.25 + reach * 0.75 };
  });
}

const BARS = makeBars(180);

export function ProofBars({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className={className} aria-hidden="true">
      {BARS.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={1.6} height={b.h} fill={b.green ? "#1fe15a" : "#f5f5f0"} opacity={b.green ? 0.95 : b.o * 0.7} />
      ))}
    </svg>
  );
}
