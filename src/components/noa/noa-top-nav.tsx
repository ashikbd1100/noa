import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PillarId } from "@/lib/noa-types";
import { PILLARS } from "@/lib/noa-data";

export type NavKey = "summary" | PillarId;

export function NoaBrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-7 items-center justify-center rounded-[5px] border border-white/15",
        className
      )}
      aria-hidden
    >
      <span
        className="absolute inset-0 rounded-[5px]"
        style={{
          background:
            "conic-gradient(from 220deg at 30% 30%, oklch(0.78 0.13 192), oklch(0.62 0.22 290), oklch(0.1 0.02 270), oklch(0.78 0.13 192))",
          opacity: 0.85,
        }}
      />
      <span className="absolute inset-[3px] rounded-[3px] bg-black/55 backdrop-blur-[1px]" />
      <span className="noa-display relative text-[11px] font-semibold tracking-tight text-white">
        N
      </span>
    </span>
  );
}

export function NoaTopNav({
  active,
  className,
}: {
  active: NavKey;
  className?: string;
}) {
  const items: { key: NavKey; href: string; label: string }[] = [
    { key: "summary", href: "/", label: "Summary" },
    ...PILLARS.map((p) => ({
      key: p.id as PillarId,
      href: `/pillar/${p.id}`,
      label: p.label,
    })),
  ];

  return (
    <div className={cn("sticky top-0 z-50 px-4 pt-4", className)}>
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-white/10 bg-black/60 px-2 py-2 backdrop-blur-xl"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-2 py-1 text-foreground transition-colors hover:bg-white/[0.04]"
        >
          <NoaBrandMark />
          <div className="hidden flex-col leading-none sm:flex">
            <span className="noa-display text-[13px] font-semibold tracking-tight">
              Noa
            </span>
            <span className="noa-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
              Diligence OS
            </span>
          </div>
        </Link>

        <span className="hidden h-6 w-px bg-white/10 sm:block" />

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "noa-mono relative shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
                  isActive
                    ? "bg-white/[0.06] text-foreground ring-1 ring-white/15"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive ? (
                  <span
                    className="absolute -left-0.5 top-1/2 size-1 -translate-y-1/2 rounded-full bg-[var(--noa-violet)]"
                    aria-hidden
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 lg:flex">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-[var(--noa-cyan)] opacity-60 noa-motion-pulse" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[var(--noa-cyan)]" />
          </span>
          <span className="noa-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Live
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="noa-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            v0.1
          </span>
        </div>
      </nav>
    </div>
  );
}
