"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export function useAnimatedNumber(target: number, durationMs = 720) {
  const [display, setDisplay] = useState(target);
  const startRef = useRef(target);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = startRef.current;
    if (start === target) return;
    const t0 = performance.now();

    function tick(now: number) {
      const u = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - (1 - u) ** 3;
      const v = Math.round(start + (target - start) * eased);
      setDisplay(v);
      if (u < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        startRef.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, durationMs]);

  return display;
}

/** Same easing as `useAnimatedNumber` but keeps fractional values (for metric headlines). */
export function useAnimatedNumberFloat(target: number, durationMs = 720) {
  const [display, setDisplay] = useState(target);
  const startRef = useRef(target);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = startRef.current;
    if (start === target) return;
    const t0 = performance.now();

    function tick(now: number) {
      const u = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - (1 - u) ** 3;
      const raw = start + (target - start) * eased;
      setDisplay(Number(raw.toPrecision(8)));
      if (u < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        startRef.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, durationMs]);

  return display;
}

export function AnimatedDigits({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const d = useAnimatedNumber(value);
  return <span className={className}>{d}</span>;
}

/** Attach ref to `.noa-accent-demo-sentinel`; fires once per accent cycle (~20s). */
export function useAccentSentinel(onIteration: () => void) {
  const ref = useRef<HTMLSpanElement>(null);
  const cb = useRef(onIteration);
  cb.current = onIteration;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => {
      cb.current();
    };
    el.addEventListener("animationiteration", handler);
    return () => el.removeEventListener("animationiteration", handler);
  }, []);

  return ref;
}
