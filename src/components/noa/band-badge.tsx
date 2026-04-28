import { cn } from "@/lib/utils";
import type { SeverityTier } from "@/lib/noa-types";

const tone: Record<
  SeverityTier,
  { dot: string; text: string; ring: string; label: string }
> = {
  red: {
    dot: "bg-[var(--noa-severity-red)]",
    text: "text-[var(--noa-severity-red)]",
    ring: "ring-[var(--noa-severity-red)]/30",
    label: "Red band",
  },
  yellow: {
    dot: "bg-[var(--noa-severity-yellow)]",
    text: "text-[var(--noa-severity-yellow)]",
    ring: "ring-[var(--noa-severity-yellow)]/30",
    label: "Yellow band",
  },
  green: {
    dot: "bg-[var(--noa-severity-green)]",
    text: "text-[var(--noa-severity-green)]",
    ring: "ring-[var(--noa-severity-green)]/30",
    label: "Green band",
  },
};

export function BandBadge({
  band,
  size = "sm",
  className,
}: {
  band: SeverityTier;
  size?: "sm" | "xs";
  className?: string;
}) {
  const t = tone[band];
  return (
    <span
      className={cn(
        "noa-mono inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-black/40 ring-1",
        t.ring,
        size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]",
        "font-medium uppercase tracking-[0.18em]",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", t.dot)} />
      <span className={t.text}>{t.label}</span>
    </span>
  );
}
