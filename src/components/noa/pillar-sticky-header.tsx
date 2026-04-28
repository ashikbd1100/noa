import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PillarMeta } from "@/lib/noa-types";
import { TARGET_COMPANY } from "@/lib/noa-data";
import { BandBadge } from "@/components/noa/band-badge";

export function PillarStickyHeader({
  pillar,
  allPillars,
  className,
}: {
  pillar: PillarMeta;
  allPillars: PillarMeta[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-[72px] z-40 px-4 pt-4",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-md border border-white/10 bg-black/65 px-4 py-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col leading-none">
            <p className="noa-eyebrow">{TARGET_COMPANY}</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <h1 className="noa-display truncate text-[15px] font-semibold tracking-tight text-foreground">
                {pillar.label}
              </h1>
              <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                / Pillar score
              </span>
              <span className="noa-display noa-tnum text-base font-semibold text-foreground">
                {pillar.score}
                <span className="noa-mono text-[10px] font-medium text-muted-foreground">
                  /100
                </span>
              </span>
            </div>
          </div>
          <BandBadge band={pillar.colorBand} size="xs" />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 lg:max-w-[60%]">
          <p className="noa-eyebrow hidden xl:block">All pillars</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {allPillars.map((p) => {
              const active = p.id === pillar.id;
              return (
                <Link
                  key={p.id}
                  href={`/pillar/${p.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "noa-mono group inline-flex items-center gap-2 rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.14em] transition-colors",
                    active
                      ? "border-[var(--noa-violet)]/55 bg-[var(--noa-violet)]/15 text-foreground"
                      : "border-white/10 bg-black/40 text-muted-foreground hover:border-white/20 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "size-1 rounded-full",
                      active
                        ? "bg-[var(--noa-violet)]"
                        : p.colorBand === "red"
                          ? "bg-[var(--noa-severity-red)]"
                          : p.colorBand === "yellow"
                            ? "bg-[var(--noa-severity-yellow)]"
                            : "bg-[var(--noa-severity-green)]"
                    )}
                  />
                  <span>{p.shortLabel}</span>
                  <span className="noa-tnum text-foreground">{p.score}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
