import { cn } from "@/lib/utils";

/**
 * Tech-debt vs. scalability deep dive — quadrant + topographic terrain.
 * Brief: dual-axis / quadrant / bubble-inspired read; 3D sculptural terrain (CSS perspective).
 * Axes: X = tech debt (left→right), Y = scalability (bottom→top).
 */
export function DeepDiveTerrain({
  techDebt,
  scalability,
  className,
}: {
  techDebt: number;
  scalability: number;
  className?: string;
}) {
  const x = Math.min(100, Math.max(0, techDebt));
  const y = Math.min(100, Math.max(0, scalability));

  const curvePts = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const px = t * 100;
    const py = 100 - 100 / (1 + Math.exp(-(t * 12 - 6))) * 0.85 - 7;
    return `${px},${py}`;
  }).join(" ");

  const pos = {
    left: `${x}%`,
    bottom: `${y}%`,
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 bg-[var(--noa-panel)]",
        className
      )}
    >
      <header className="flex flex-col gap-1 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="noa-eyebrow">06 / Tech debt vs. scalability</p>
          <h2 className="noa-display mt-2 text-lg font-semibold tracking-tight">
            Position, not just a score
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Where this target lands on the inverse-tension spectrum within this
          pillar. Precision landscape — sculptural read (not a consumer chart).
        </p>
      </header>

      <div className="relative grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-stretch">
        {/* 3D terrain stage — brief: terrain-style / structural model */}
        <div
          className="relative flex items-center justify-center py-6 md:py-8"
          style={{ perspective: "1100px" }}
        >
          <div className="relative w-full origin-center [transform-style:preserve-3d] transition-transform duration-700 ease-out [transform:rotateX(50deg)_rotateZ(-2.5deg)_scale(0.92)] hover:[transform:rotateX(56deg)_rotateZ(-3deg)_scale(0.9)]">
            {/* Ridge layers (depth) */}
            <div
              className="pointer-events-none absolute inset-[12%] rounded-md border border-white/[0.07] bg-black/20"
              style={{ transform: "translateZ(12px)" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-[18%] rounded-md border border-white/[0.05] bg-black/25"
              style={{ transform: "translateZ(24px)" }}
              aria-hidden
            />

            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-white/10 bg-black noa-grid-faint noa-scanlines shadow-[0_24px_48px_-24px_oklch(0_0_0/0.8)]">
              <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-white/12" />
              <div className="absolute inset-y-4 left-1/2 border-l border-dashed border-white/12" />

              <span className="noa-eyebrow absolute bottom-2 left-3">
                Tech debt →
              </span>
              <span className="noa-eyebrow absolute left-3 top-3">
                Scalability ↑
              </span>
              <span className="noa-mono absolute bottom-2 right-3 text-[9px] uppercase tracking-[0.18em] text-white/30">
                QI
              </span>
              <span className="noa-mono absolute right-3 top-3 text-[9px] uppercase tracking-[0.18em] text-white/30">
                QII
              </span>

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-4"
                aria-hidden
              >
                <defs>
                  <linearGradient id="noaTerrainFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.62 0.22 290 / 0.4)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.22 290 / 0)" />
                  </linearGradient>
                  <linearGradient id="noaTerrainRidge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="oklch(0.78 0.13 192 / 0)" />
                    <stop offset="50%" stopColor="oklch(0.78 0.13 192 / 0.65)" />
                    <stop offset="100%" stopColor="oklch(0.78 0.13 192 / 0)" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,100 ${curvePts} 100,100`}
                  fill="url(#noaTerrainFill)"
                />
                <polyline
                  points={curvePts}
                  fill="none"
                  stroke="url(#noaTerrainRidge)"
                  strokeWidth="0.85"
                />
                <polyline
                  points={curvePts}
                  fill="none"
                  stroke="oklch(0.78 0.13 192 / 0.35)"
                  strokeWidth="0.35"
                  transform="translate(0, -1.2)"
                />
              </svg>

              {/* Bubble cluster — brief: node/bubble visualization cue */}
              <div className="pointer-events-none absolute right-[12%] top-[14%] flex items-center gap-1.5 opacity-80">
                <span className="size-2 rounded-full border border-white/25 bg-[oklch(0.62_0.22_290/0.35)] shadow-[0_0_12px_oklch(0.62_0.22_290/0.4)]" />
                <span className="size-3 rounded-full border border-white/30 bg-[oklch(0.78_0.13_192/0.25)] shadow-[0_0_14px_oklch(0.78_0.13_192/0.35)]" />
                <span className="size-1.5 rounded-full border border-white/20 bg-white/10" />
              </div>

              <div
                className="absolute z-10"
                style={{
                  left: `calc(${pos.left} - 8px)`,
                  bottom: `calc(${pos.bottom} - 8px)`,
                }}
              >
                <div className="relative" style={{ transform: "translateZ(36px)" }}>
                  <span className="absolute inset-[-10px] rounded-full bg-[var(--noa-violet)]/25 blur-md" />
                  <span className="relative block size-3 rotate-45 rounded-[2px] border border-white/40 bg-gradient-to-br from-[var(--noa-cyan)] to-[var(--noa-violet)] shadow-[0_8px_20px_-4px_oklch(0.62_0.22_290/0.5)]" />
                </div>
              </div>

              <div className="absolute bottom-3 right-3 noa-mono rounded-sm border border-white/10 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Position · <span className="noa-tnum text-foreground">{x}</span> /
                <span className="noa-tnum text-foreground"> {y}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="noa-eyebrow">Read</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Position encodes the debt/scalability tension for this pillar — a
              dual-axis read with quadrant scaffolding, topographic emphasis, and
              a node cluster cue (Fortexa-inspired). Tilt the stage on hover.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
            <div>
              <p className="noa-eyebrow">Tech debt</p>
              <p className="noa-display noa-tnum mt-1.5 text-xl font-semibold text-foreground">
                {x}
              </p>
            </div>
            <div>
              <p className="noa-eyebrow">Scalability</p>
              <p className="noa-display noa-tnum mt-1.5 text-xl font-semibold text-foreground">
                {y}
              </p>
            </div>
          </div>
          <div className="rounded-sm border border-white/[0.06] bg-black/30 p-3">
            <p className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Quadrants
            </p>
            <ul className="mt-2 space-y-1.5 text-[11px] leading-snug text-foreground/85">
              <li>
                <span className="text-white/35">QII</span> — High debt, high
                scalability (refactor opportunity)
              </li>
              <li>
                <span className="text-white/35">QI</span> — High debt, low
                scalability (risk concentration)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
