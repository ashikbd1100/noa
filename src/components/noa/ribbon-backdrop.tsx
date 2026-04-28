"use client";

import { cn } from "@/lib/utils";

/**
 * Brief: sinuous 3D ribbon / wave — slow, subtle motion in hero moments (not aggressive loops).
 */
export function RibbonBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <svg
        className="absolute -left-[10%] top-[18%] h-[45%] w-[120%] opacity-[0.35]"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="noaRibbonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.62 0.22 290 / 0)" />
            <stop offset="35%" stopColor="oklch(0.78 0.13 192 / 0.55)" />
            <stop offset="65%" stopColor="oklch(0.62 0.22 290 / 0.45)" />
            <stop offset="100%" stopColor="oklch(0.78 0.13 192 / 0)" />
          </linearGradient>
        </defs>
        <path
          d="M -40 120 C 120 40, 280 180, 400 100 S 620 20, 840 100"
          fill="none"
          stroke="url(#noaRibbonStroke)"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="noa-ribbon-path"
        />
        <path
          d="M -40 145 C 140 70, 300 195, 420 115 S 640 45, 860 115"
          fill="none"
          stroke="url(#noaRibbonStroke)"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity={0.55}
          className="noa-ribbon-path-alt"
        />
      </svg>
    </div>
  );
}
