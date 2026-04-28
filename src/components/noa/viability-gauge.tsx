import { cn } from "@/lib/utils";

function polar(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
}

export function ViabilityGauge({
  score,
  className,
  size = "lg",
  label = "Viability",
  caption,
}: {
  score: number;
  className?: string;
  size?: "lg" | "md" | "sm";
  label?: string;
  caption?: string;
}) {
  const cx = 150;
  const cy = 150;
  const trackR = size === "sm" ? 96 : size === "md" ? 110 : 122;
  const valueR = trackR;
  const clamped = Math.min(100, Math.max(0, score));

  /* Sweep from 225° down to -45° (bottom-left → bottom-right), 270° total */
  const startDeg = 225;
  const endDeg = -45;
  const totalDeg = startDeg - endDeg; /* 270 */
  const valueDeg = startDeg - (clamped / 100) * totalDeg;

  const toRad = (d: number) => (d * Math.PI) / 180;

  const trackStart = polar(cx, cy, trackR, toRad(startDeg));
  const trackEnd = polar(cx, cy, trackR, toRad(endDeg));
  const valueStart = trackStart;
  const valueEnd = polar(cx, cy, valueR, toRad(valueDeg));

  const trackLargeArc = totalDeg > 180 ? 1 : 0;
  const valueLargeArc = startDeg - valueDeg > 180 ? 1 : 0;

  /* Tick marks every 5% along the arc, with longer ticks every 25% */
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const t = startDeg - (i / 20) * totalDeg;
    const major = i % 5 === 0;
    const inner = polar(cx, cy, trackR - (major ? 14 : 8), toRad(t));
    const outer = polar(cx, cy, trackR - 2, toRad(t));
    return (
      <line
        key={i}
        x1={inner.x}
        y1={inner.y}
        x2={outer.x}
        y2={outer.y}
        className={major ? "stroke-white/40" : "stroke-white/15"}
        strokeWidth={major ? 1.25 : 0.75}
      />
    );
  });

  const w = 300;
  const h = size === "sm" ? 220 : size === "md" ? 250 : 270;

  const numCls =
    size === "sm"
      ? "text-3xl"
      : size === "md"
        ? "text-[44px]"
        : "text-[64px]";

  return (
    <div className={cn("relative mx-auto w-full max-w-[300px]", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="block w-full"
        role="img"
        aria-label={`Overall viability score ${clamped} out of 100`}
      >
        <defs>
          <linearGradient id="noaGaugeValue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.78 0.13 192)" />
            <stop offset="55%" stopColor="oklch(0.62 0.22 290)" />
            <stop offset="100%" stopColor="oklch(0.78 0.13 192)" />
          </linearGradient>
          <radialGradient id="noaGaugeHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.62 0.22 290 / 0.18)" />
            <stop offset="60%" stopColor="oklch(0.62 0.22 290 / 0)" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={trackR + 14} fill="url(#noaGaugeHalo)" />

        {/* Track */}
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${trackR} ${trackR} 0 ${trackLargeArc} 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="oklch(1 0 0 / 0.08)"
          strokeWidth={2}
        />

        {ticks}

        {/* Value arc */}
        <path
          d={`M ${valueStart.x} ${valueStart.y} A ${valueR} ${valueR} 0 ${valueLargeArc} 1 ${valueEnd.x} ${valueEnd.y}`}
          fill="none"
          stroke="url(#noaGaugeValue)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Value tip dot */}
        <circle
          cx={valueEnd.x}
          cy={valueEnd.y}
          r={4.5}
          fill="oklch(0.92 0.06 290)"
          stroke="oklch(0 0 0)"
          strokeWidth={1.5}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "noa-display font-semibold leading-none tabular-nums tracking-tight text-foreground",
              numCls
            )}
          >
            {clamped}
          </span>
          <span className="noa-mono text-xs font-medium text-muted-foreground">
            /100
          </span>
        </div>
        <span className="noa-eyebrow mt-2">{label}</span>
        {caption ? (
          <span className="mt-2 max-w-[200px] text-[10px] leading-snug text-muted-foreground">
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  );
}
