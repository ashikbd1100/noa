import { cn } from "@/lib/utils";
import type { PillarId } from "@/lib/noa-types";

const accents: Record<PillarId, { hue: string; rotate: string; second: string }> = {
  applications: {
    hue: "oklch(0.78 0.13 192)",
    rotate: "rotate-12",
    second: "oklch(0.62 0.22 290)",
  },
  "cloud-infra": {
    hue: "oklch(0.62 0.22 290)",
    rotate: "-rotate-6",
    second: "oklch(0.78 0.13 192)",
  },
  architecture: {
    hue: "oklch(0.7 0.15 240)",
    rotate: "rotate-3",
    second: "oklch(0.62 0.22 290)",
  },
  security: {
    hue: "oklch(0.55 0.16 290)",
    rotate: "-rotate-12",
    second: "oklch(0.78 0.13 192)",
  },
  personnel: {
    hue: "oklch(0.78 0.13 192)",
    rotate: "rotate-6",
    second: "oklch(0.7 0.15 240)",
  },
};

export function PillarVolumetricMark({
  pillarId,
  className,
  size = 48,
}: {
  pillarId: PillarId;
  className?: string;
  size?: number;
}) {
  const a = accents[pillarId];
  return (
    <div
      className={cn(
        "relative shrink-0 [perspective:900px]",
        a.rotate,
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-[5px] border border-white/20"
        style={{
          background: `conic-gradient(from 200deg at 30% 30%, ${a.hue}, ${a.second}, oklch(0.16 0.02 270), ${a.hue})`,
          boxShadow:
            "inset 0 1px 0 oklch(1 0 0 / 0.18), inset 0 0 14px oklch(0 0 0 / 0.5)",
        }}
      />
      <div className="absolute inset-[3px] rounded-[3px] border border-white/15 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="absolute inset-[7px] rounded-[2px]"
        style={{
          background: `linear-gradient(135deg, ${a.hue} 0%, transparent 65%)`,
          opacity: 0.55,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
