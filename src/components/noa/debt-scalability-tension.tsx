import { cn } from "@/lib/utils";

export function DebtScalabilityTension({
  techDebt,
  scalability,
  className,
  dense = false,
}: {
  techDebt: number;
  scalability: number;
  className?: string;
  dense?: boolean;
}) {
  const debt = Math.min(100, Math.max(0, techDebt));
  const scale = Math.min(100, Math.max(0, scalability));
  const dominantDebt = debt > scale;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="noa-eyebrow">Tech debt</span>
          <span
            className={cn(
              "noa-mono noa-tnum text-xs font-medium",
              dominantDebt ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {debt}
          </span>
        </div>
        <span className="noa-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
          inverse axis
        </span>
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "noa-mono noa-tnum text-xs font-medium",
              !dominantDebt ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {scale}
          </span>
          <span className="noa-eyebrow">Scalability</span>
        </div>
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[3px] border border-white/10 bg-black",
          dense ? "h-1.5" : "h-2.5"
        )}
        aria-label={`Tech debt ${debt}, scalability ${scale}; inverse tension axis`}
      >
        {/* Hues intentionally avoid traffic R/Y/G — those are reserved for severity only */}
        <div
          className="absolute inset-y-0 left-0 transition-[width] duration-500"
          style={{
            width: `${debt}%`,
            background:
              "linear-gradient(90deg, oklch(0.55 0.16 290 / 0.95), oklch(0.62 0.22 290 / 0.5))",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 transition-[width] duration-500"
          style={{
            width: `${scale}%`,
            background:
              "linear-gradient(270deg, oklch(0.78 0.13 192 / 0.9), oklch(0.78 0.13 192 / 0.4))",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-[-2px] w-px bg-white/55"
          style={{ left: `${debt}%` }}
          aria-hidden
        />
      </div>

      {!dense ? (
        <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
          Inverse by design — as debt rises, scalability headroom compresses.
        </p>
      ) : null}
    </div>
  );
}
