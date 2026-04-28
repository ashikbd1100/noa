import { cn } from "@/lib/utils";
import type { SeverityTier } from "@/lib/noa-types";

const fillVar: Record<SeverityTier, string> = {
  red: "var(--noa-severity-red)",
  yellow: "var(--noa-severity-yellow)",
  green: "var(--noa-severity-green)",
};

export function InlineSeverityBar({
  severity,
  score,
  className,
}: {
  severity: SeverityTier;
  score: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, score));
  const segments = 16;
  const filled = Math.round((pct / 100) * segments);

  return (
    <div
      className={cn("flex w-28 items-center gap-1", className)}
      title={`Severity ${pct}`}
    >
      <span className="noa-mono text-[9px] tabular-nums text-muted-foreground">
        {String(pct).padStart(2, "0")}
      </span>
      <div className="flex h-2 flex-1 items-stretch gap-px overflow-hidden rounded-[2px] border border-white/10 bg-black">
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className="h-full flex-1"
            style={{
              background:
                i < filled
                  ? fillVar[severity]
                  : "oklch(1 0 0 / 0.05)",
              opacity: i < filled ? 0.5 + (i / segments) * 0.5 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
