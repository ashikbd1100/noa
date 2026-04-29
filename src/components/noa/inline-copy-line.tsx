"use client";

import { useCallback, useRef } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One hover-revealed copy control per logical line/block (for pasting into Figma, etc.).
 * Temporary UX — remove when no longer needed.
 */
export function InlineCopyLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const copy = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    const text = el.innerText.replace(/\u00a0/g, " ").replace(/\s+\n/g, "\n").trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div
      className={cn(
        "group/copy-line flex w-full min-w-0 items-start gap-1.5",
        className
      )}
    >
      <div ref={ref} className="min-w-0 flex-1">
        {children}
      </div>
      <button
        type="button"
        aria-label="Copy line"
        className={cn(
          "mt-px shrink-0 rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity duration-150",
          "hover:bg-white/[0.06] hover:text-foreground",
          "group-hover/copy-line:opacity-100 focus-visible:opacity-100",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--noa-violet)]/45"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void copy();
        }}
      >
        <Copy className="size-2.5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
