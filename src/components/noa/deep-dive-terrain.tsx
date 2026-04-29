"use client";

import { useCallback, useRef, useState } from "react";

import { useAnimatedNumberFloat } from "@/components/noa/noa-demo-motion";
import { InlineCopyLine } from "@/components/noa/inline-copy-line";
import { cn } from "@/lib/utils";

const DEFAULT_RX = 50;
const DEFAULT_RY = 0;
const DEFAULT_RZ = -2.5;
const SCALE = 0.92;
const DRAG_SENS = 0.32;
const RX_MIN = 22;
const RX_MAX = 78;

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
  const ax = useAnimatedNumberFloat(x);
  const ay = useAnimatedNumberFloat(y);

  const curvePts = Array.from({ length: 20 }, (_, i) => {
    const t = i / 19;
    const px = t * 100;
    const py = 100 - 100 / (1 + Math.exp(-(t * 12 - 6))) * 0.85 - 7;
    return `${px},${py}`;
  }).join(" ");

  const pos = {
    left: `${ax}%`,
    bottom: `${ay}%`,
  };

  const [rx, setRx] = useState(DEFAULT_RX);
  const [ry, setRy] = useState(DEFAULT_RY);
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    setDragging(true);
    lastRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };
    setRy((prev) => prev + dx * DRAG_SENS);
    setRx((prev) =>
      Math.min(RX_MAX, Math.max(RX_MIN, prev - dy * DRAG_SENS))
    );
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* released */
    }
  }, []);

  const onLostCapture = useCallback(() => {
    draggingRef.current = false;
    setDragging(false);
  }, []);

  const resetRotation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setRx(DEFAULT_RX);
    setRy(DEFAULT_RY);
  }, []);

  const transformStyle = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${DEFAULT_RZ}deg) scale(${SCALE})`;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 bg-[var(--noa-panel)]",
        className
      )}
    >
      <header className="flex flex-col gap-3 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <InlineCopyLine>
            <p className="noa-eyebrow">03 / Tech debt vs. scalability</p>
          </InlineCopyLine>
          <InlineCopyLine>
            <h2 className="noa-display text-lg font-semibold tracking-tight">
              Position, not just a score
            </h2>
          </InlineCopyLine>
        </div>
        <InlineCopyLine className="max-w-md">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Where this target lands on the inverse-tension spectrum within this
            pillar. Precision landscape — sculptural read (not a consumer chart).
          </p>
        </InlineCopyLine>
      </header>

      <div className="relative grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-stretch">
        {/* 3D terrain stage — drag to orbit; double-click stage to reset */}
        <div
          className="relative flex items-center justify-center py-6 md:py-8"
          style={{ perspective: "1100px" }}
        >
          <div
            role="application"
            aria-label="Terrain chart in 3D. Drag to rotate. Double-click to reset."
            tabIndex={0}
            className={cn(
              "relative w-full origin-center touch-none select-none [transform-style:preserve-3d]",
              "cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--noa-panel)]",
              dragging && "cursor-grabbing",
              !dragging && "transition-transform duration-700 ease-out"
            )}
            style={{ transform: transformStyle }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={onLostCapture}
            onDoubleClick={resetRotation}
          >
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

              <div className="pointer-events-none absolute bottom-3 right-3 noa-mono rounded-sm border border-white/10 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Position ·{" "}
                <span className="noa-tnum text-foreground">{Math.round(ax)}</span> /
                <span className="noa-tnum text-foreground"> {Math.round(ay)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <InlineCopyLine>
              <p className="noa-eyebrow">Read</p>
            </InlineCopyLine>
            <InlineCopyLine>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Position encodes the debt/scalability tension for this pillar — a
                dual-axis read with quadrant scaffolding, topographic emphasis, and
                a node cluster cue (Fortexa-inspired). Drag to orbit the stage;
                double-click to reset.
              </p>
            </InlineCopyLine>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
            <div className="space-y-2">
              <InlineCopyLine>
                <p className="noa-eyebrow">Tech debt</p>
              </InlineCopyLine>
              <InlineCopyLine>
                <p className="noa-display noa-tnum text-xl font-semibold text-foreground">
                  {Math.round(ax)}
                </p>
              </InlineCopyLine>
            </div>
            <div className="space-y-2">
              <InlineCopyLine>
                <p className="noa-eyebrow">Scalability</p>
              </InlineCopyLine>
              <InlineCopyLine>
                <p className="noa-display noa-tnum text-xl font-semibold text-foreground">
                  {Math.round(ay)}
                </p>
              </InlineCopyLine>
            </div>
          </div>
          <div className="rounded-sm border border-white/[0.06] bg-black/30 p-3">
            <InlineCopyLine>
              <p className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Quadrants
              </p>
            </InlineCopyLine>
            <ul className="mt-2 space-y-2">
              <li>
                <InlineCopyLine>
                  <span className="text-[11px] leading-snug text-foreground/85">
                    <span className="text-white/35">QII</span> — High debt, high
                    scalability (refactor opportunity)
                  </span>
                </InlineCopyLine>
              </li>
              <li>
                <InlineCopyLine>
                  <span className="text-[11px] leading-snug text-foreground/85">
                    <span className="text-white/35">QI</span> — High debt, low
                    scalability (risk concentration)
                  </span>
                </InlineCopyLine>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
