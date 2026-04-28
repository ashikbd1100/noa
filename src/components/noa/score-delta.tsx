import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScoreDelta({
  current,
  prior,
  className,
  compact = false,
}: {
  current: number;
  prior: number;
  className?: string;
  compact?: boolean;
}) {
  const delta = current - prior;
  const up = delta >= 0;
  return (
    <span
      className={cn(
        "noa-mono inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 px-2 py-1 text-[10px] tabular-nums uppercase tracking-[0.16em]",
        className
      )}
    >
      {up ? (
        <ArrowUpRight className="size-3 text-[var(--noa-cyan)]" aria-hidden />
      ) : (
        <ArrowDownRight className="size-3 text-muted-foreground" aria-hidden />
      )}
      <span className="text-foreground">
        {up ? "+" : ""}
        {delta}
      </span>
      {!compact ? (
        <span className="text-muted-foreground">vs prior</span>
      ) : null}
    </span>
  );
}
