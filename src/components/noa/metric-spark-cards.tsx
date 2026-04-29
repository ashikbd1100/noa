import { InlineCopyLine } from "@/components/noa/inline-copy-line";
import { Panel } from "@/components/noa/panel";
import type { MetricCard } from "@/lib/noa-types";
import { cn } from "@/lib/utils";

function MiniSpark({ series }: { series: number[] }) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const w = 120;
  const h = 36;
  const pad = 2;
  const pts = series.map((v, i) => {
    const x = pad + (i / Math.max(1, series.length - 1)) * (w - pad * 2);
    const t = max === min ? 0.5 : (v - min) / (max - min);
    const y = pad + (1 - t) * (h - pad * 2);
    return { x, y, raw: v };
  });
  const linePts = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPts = `${pad},${h - pad} ${linePts} ${w - pad},${h - pad}`;
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-9 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="noaSparkArea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.62 0.22 290 / 0.45)" />
          <stop offset="100%" stopColor="oklch(0.62 0.22 290 / 0)" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill="url(#noaSparkArea)" />
      <polyline
        fill="none"
        stroke="oklch(0.78 0.13 192)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePts}
      />
      <circle
        cx={last.x}
        cy={last.y}
        r={2.4}
        fill="oklch(0.92 0.06 290)"
        stroke="oklch(0 0 0)"
        strokeWidth={1}
      />
    </svg>
  );
}

function trendDelta(series: number[]) {
  if (series.length < 2) return 0;
  const first = series[0];
  const last = series[series.length - 1];
  if (first === 0) return 0;
  return Math.round(((last - first) / Math.abs(first)) * 100);
}

export function MetricSparkCards({
  metrics,
  className,
}: {
  metrics: MetricCard[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {metrics.map((m, idx) => {
        const delta = trendDelta(m.series);
        const up = delta >= 0;
        return (
          <Panel
            key={m.id}
            tone="panel"
            brackets
            className="px-4 py-4 noa-row-hover"
          >
            <InlineCopyLine>
              <div className="flex items-center justify-between gap-2">
                <p className="noa-eyebrow">{m.label}</p>
                <span className="noa-mono text-[9px] tabular-nums text-white/30">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
            </InlineCopyLine>
            <InlineCopyLine>
              <p className="noa-display noa-tnum mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {m.value}
              </p>
            </InlineCopyLine>
            <InlineCopyLine>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    "noa-mono text-[10px] tabular-nums uppercase tracking-[0.16em]",
                    up ? "text-[var(--noa-cyan)]" : "text-muted-foreground"
                  )}
                >
                  {up ? "+" : ""}
                  {delta}%
                </span>
                <span className="noa-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  trailing
                </span>
              </div>
            </InlineCopyLine>
            <MiniSpark series={m.series} />
          </Panel>
        );
      })}
    </div>
  );
}
