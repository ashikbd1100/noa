import { cn } from "@/lib/utils";
import type { SeverityTier } from "@/lib/noa-types";

const tierClass: Record<SeverityTier, string> = {
  red: "bg-[var(--noa-severity-red)] shadow-[0_0_12px_var(--noa-severity-red)]",
  yellow:
    "bg-[var(--noa-severity-yellow)] shadow-[0_0_12px_var(--noa-severity-yellow)]",
  green:
    "bg-[var(--noa-severity-green)] shadow-[0_0_10px_var(--noa-severity-green)]",
};

export function SeverityDot({
  tier,
  className,
  pulse = false,
}: {
  tier: SeverityTier;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        tierClass[tier],
        pulse && "noa-motion-pulse",
        className
      )}
      aria-hidden
    />
  );
}

export function severityTierLabel(tier: SeverityTier): string {
  switch (tier) {
    case "red":
      return "🔴 Red flags";
    case "yellow":
      return "🟡 Yellow flags";
    case "green":
      return "🟢 Green flags";
  }
}

export function severityTierGlyph(tier: SeverityTier): string {
  switch (tier) {
    case "red":
      return "R";
    case "yellow":
      return "Y";
    case "green":
      return "G";
  }
}
