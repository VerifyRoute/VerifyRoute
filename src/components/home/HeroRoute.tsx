"use client";

import { useEffect, useState } from "react";
import { Mark } from "@/components/Logo";

/* "The Route": a router at the center, models on orbit rings around it.
   Every few seconds one route is drawn, checked and settled, and the card
   beside it shows what that call would carry. The values are simulated and
   labelled as such; nothing here claims a live call. */

type Node = { name: string; x: number; y: number };

const NODES: Node[] = [
  { name: "qwq-32b", x: 470, y: 70 },
  { name: "qwen3-235b", x: 700, y: 110 },
  { name: "llama-3.3-70b", x: 610, y: 200 },
  { name: "nemotron-70b", x: 330, y: 190 },
  { name: "deepseek-r1", x: 800, y: 250 },
  { name: "mistral-small", x: 815, y: 360 },
  { name: "hermes-4-70b", x: 250, y: 320 },
  { name: "command-r", x: 190, y: 430 },
  { name: "gemma-3-27b", x: 820, y: 480 },
  { name: "kimi-k2", x: 790, y: 590 },
  { name: "phi-4", x: 250, y: 610 },
  { name: "gpt-oss-120b", x: 420, y: 720 },
  { name: "glm-4.6", x: 700, y: 700 },
  { name: "mixtral-8x22b", x: 330, y: 800 },
];

const CENTER = { x: 560, y: 450 };

const ROUTES = [
  { model: "llama-3.3-70b", provider: "Quarry Compute", lane: "attested", latency: 284, tokens: 312, cost: "0.000061", receipt: "7c1e…a90b", canary: "12 / 12" },
  { model: "deepseek-r1", provider: "Tidewater Labs", lane: "standard", latency: 611, tokens: 904, cost: "0.000947", receipt: "3f9a…c21e", canary: "11 / 11" },
  { model: "mistral-small", provider: "Meridian GPU", lane: "standard", latency: 142, tokens: 188, cost: "0.000022", receipt: "b05d…19f4", canary: "12 / 12" },
  { model: "qwen3-235b", provider: "Ember Nodes", lane: "attested", latency: 398, tokens: 527, cost: "0.000311", receipt: "e2c8…7d03", canary: "10 / 10" },
  { model: "gemma-3-27b", provider: "Quarry Compute", lane: "standard", latency: 176, tokens: 240, cost: "0.000019", receipt: "91ab…4e6f", canary: "12 / 12" },
  { model: "kimi-k2", provider: "Northgate AI", lane: "attested", latency: 455, tokens: 663, cost: "0.000402", receipt: "5d70…ee21", canary: "9 / 9" },
];

const CYCLE_MS = 3600;

function curve(to: Node) {
  const mx = (CENTER.x + to.x) / 2;
  const my = (CENTER.y + to.y) / 2;
  const dx = to.x - CENTER.x;
  const dy = to.y - CENTER.y;
  // Bend perpendicular to the straight line for a softer route.
  const cx = mx - dy * 0.18;
  const cy = my + dx * 0.18;
  return `M${CENTER.x} ${CENTER.y} Q${cx} ${cy} ${to.x} ${to.y}`;
}

export function HeroGraph({ className = "" }: { className?: string }) {
  const index = useRouteIndex();
  const route = ROUTES[index];
  const target = NODES.find((n) => n.name === route.model) ?? NODES[0];
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 1000 860" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="vr-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#1fe15a" stopOpacity="0.16" />
            <stop offset="1" stopColor="#1fe15a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CENTER.x} cy={CENTER.y} r="360" fill="url(#vr-glow)" />
        {[130, 250, 380].map((r) => (
          <circle key={r} cx={CENTER.x} cy={CENTER.y} r={r} fill="none" stroke="#f5f5f0" strokeOpacity="0.08" />
        ))}
        {NODES.map((n) => (
          <path key={n.name} d={curve(n)} fill="none" stroke="#f5f5f0" strokeOpacity={n === target ? 0 : 0.07} />
        ))}
        <path key={route.model} d={curve(target)} fill="none" stroke="#1fe15a" strokeWidth="1.6" strokeDasharray="900" strokeDashoffset="900">
          <animate attributeName="stroke-dashoffset" from="900" to="0" dur="0.9s" fill="freeze" />
        </path>
        {NODES.map((n) => {
          const active = n === target;
          const right = n.x > CENTER.x;
          return (
            <g key={n.name}>
              <rect x={n.x - 4} y={n.y - 4} width="8" height="8" fill={active ? "#1fe15a" : "none"} stroke={active ? "#1fe15a" : "#f5f5f0"} strokeOpacity={active ? 1 : 0.45} />
              <text
                x={right ? n.x + 14 : n.x - 14}
                y={n.y + 4}
                textAnchor={right ? "start" : "end"}
                fontFamily="var(--font-martian), monospace"
                fontSize="15"
                fill={active ? "#1fe15a" : "#f5f5f0"}
                fillOpacity={active ? 1 : 0.42}
              >
                {n.name}
              </text>
            </g>
          );
        })}
        <rect x={CENTER.x - 42} y={CENTER.y - 42} width="84" height="84" fill="#131513" stroke="#f5f5f0" strokeOpacity="0.4" />
        <circle cx={CENTER.x} cy={CENTER.y} r="64" fill="none" stroke="#1fe15a" strokeOpacity="0.35">
          <animate attributeName="r" values="52;70;52" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.45;0;0.45" dur="3.6s" repeatCount="indefinite" />
        </circle>
        <text x={CENTER.x} y={CENTER.y + 66} textAnchor="middle" fontFamily="var(--font-martian), monospace" fontSize="12" fill="#f5f5f0" fillOpacity="0.6" letterSpacing="1.5">
          VERIFY
        </text>
      </svg>
      <div className="pointer-events-none absolute" style={{ left: `${(CENTER.x / 1000) * 100}%`, top: `${(CENTER.y / 860) * 100}%`, transform: "translate(-50%,-50%)" }}>
        <span className="text-paper">
          <Mark size={40} />
        </span>
      </div>
    </div>
  );
}

let shared = 0;
const listeners = new Set<(i: number) => void>();
let timer: number | null = null;

/** One clock for the graph and the card, so both show the same route. */
function useRouteIndex() {
  const [index, setIndex] = useState(shared);
  useEffect(() => {
    listeners.add(setIndex);
    if (timer === null) {
      timer = window.setInterval(() => {
        shared = (shared + 1) % ROUTES.length;
        listeners.forEach((fn) => fn(shared));
      }, CYCLE_MS);
    }
    return () => {
      listeners.delete(setIndex);
      if (listeners.size === 0 && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return index;
}

export function RouteCard({ className = "" }: { className?: string }) {
  const index = useRouteIndex();
  const r = ROUTES[index];
  const rows: [string, React.ReactNode][] = [
    ["model", r.model],
    ["provider", r.provider],
    ["bond", <span key="b" className="text-signal">10,000 USDG ✓</span>],
    ["canaries", <span key="c" className="text-signal">pass {r.canary}</span>],
    ["lane", r.lane === "attested" ? <span key="l" className="text-signal">TEE attested ✓</span> : "standard"],
    ["latency", `${r.latency} ms`],
    ["tokens", r.tokens],
    ["cost", `${r.cost} USDG`],
    ["receipt", <span key="r" className="text-signal">ed25519 {r.receipt}</span>],
  ];
  return (
    <div className={`border border-line-dark bg-ink-2/95 font-mono text-[11.5px] uppercase tracking-[0.06em] text-paper backdrop-blur ${className}`}>
      <div className="flex items-center justify-between border-b border-line-dark px-4 py-3">
        <span className="flex items-center gap-2">
          <i className="size-1.5 animate-pulse-dot bg-signal" /> Route #{1042 + index}
        </span>
        <span className="text-muted-dark">Simulated</span>
      </div>
      <dl className="px-4 py-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 border-b border-dashed border-line-dark py-[7px] last:border-0">
            <dt className="text-muted-dark">{k}</dt>
            <dd className="truncate normal-case tracking-normal">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="h-[3px] bg-ink-4">
        <div key={index} className="h-full bg-signal" style={{ animation: `vr-progress ${CYCLE_MS}ms linear forwards` }} />
      </div>
      <style>{`@keyframes vr-progress{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}
