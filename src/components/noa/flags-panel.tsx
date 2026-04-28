"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { FlagItem, SeverityTier } from "@/lib/noa-types";

const tiers: SeverityTier[] = ["red", "yellow", "green"];

const tierTone: Record<
  SeverityTier,
  { label: string; color: string; bg: string }
> = {
  red: {
    label: "🔴 Red flags — blockers / immediate attention",
    color: "var(--noa-severity-red)",
    bg: "oklch(0.65 0.22 25 / 0.10)",
  },
  yellow: {
    label: "🟡 Yellow flags — watch / diligence",
    color: "var(--noa-severity-yellow)",
    bg: "oklch(0.84 0.16 95 / 0.10)",
  },
  green: {
    label: "🟢 Green flags — strengths / validation",
    color: "var(--noa-severity-green)",
    bg: "oklch(0.74 0.16 145 / 0.10)",
  },
};

export function FlagsPanel({
  flags,
  title = "Flags summary",
  subtitle = "Executive memo — scannable, ranked by severity.",
  index = "05",
  className,
}: {
  flags: FlagItem[];
  title?: string;
  subtitle?: string;
  index?: string;
  className?: string;
}) {
  const [filter, setFilter] = useState<"all" | SeverityTier>("all");

  const grouped = useMemo(() => {
    const g: Record<SeverityTier, FlagItem[]> = { red: [], yellow: [], green: [] };
    for (const f of flags) g[f.tier].push(f);
    return g;
  }, [flags]);

  const visibleTiers = useMemo(() => {
    if (filter === "all") return tiers;
    return [filter];
  }, [filter]);

  return (
    <section
      className={cn(
        "rounded-lg border border-white/10 bg-[var(--noa-panel)]",
        className
      )}
    >
      <header className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="noa-eyebrow">{index} / {title}</p>
          <h2 className="noa-display mt-2 text-lg font-semibold tracking-tight">
            Ranked, declarative, severity-first
          </h2>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="noa-eyebrow inline-flex items-center gap-1.5">
            <Filter className="size-3" aria-hidden /> Tier
          </span>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as "all" | SeverityTier)}
          >
            <TabsList variant="nav" className="h-auto min-h-8 flex-wrap">
              <TabsTrigger value="all">
                <span className="relative">All</span>
              </TabsTrigger>
              <TabsTrigger value="red">
                <span className="relative">Red</span>
              </TabsTrigger>
              <TabsTrigger value="yellow">
                <span className="relative">Yellow</span>
              </TabsTrigger>
              <TabsTrigger value="green">
                <span className="relative">Green</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="divide-y divide-white/[0.06]">
        {visibleTiers.map((tier) => {
          const list = grouped[tier];
          const count = list.length;
          const t = tierTone[tier];
          return (
            <Collapsible
              key={tier}
              defaultOpen={tier === "red" || filter !== "all"}
            >
              <CollapsibleTrigger className="group/flag flex h-12 w-full cursor-pointer items-center justify-between rounded-none border-0 bg-transparent px-5 text-left noa-row-hover">
                <span className="flex items-center gap-3">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: t.color, boxShadow: `0 0 12px ${t.color}` }}
                    aria-hidden
                  />
                  <span className="text-left text-[11px] font-medium leading-snug text-foreground">
                    {t.label}
                  </span>
                  <span
                    className="noa-mono inline-flex items-center justify-center rounded-sm border px-1.5 py-0.5 text-[10px] tabular-nums"
                    style={{
                      borderColor: `${t.color}55`,
                      color: t.color,
                      background: t.bg,
                    }}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-aria-expanded/flag:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="space-y-0 px-5 pb-4 pt-0">
                  {list.length === 0 ? (
                    <li className="text-xs text-muted-foreground">
                      No items in this tier under current view.
                    </li>
                  ) : (
                    list.map((f, i) => (
                      <li
                        key={f.id}
                        className="grid grid-cols-[auto_auto_1fr] items-baseline gap-3 border-b border-white/[0.04] py-3 last:border-b-0"
                      >
                        <span className="noa-mono text-[10px] tabular-nums uppercase tracking-[0.16em] text-white/35">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="size-1 translate-y-[5px] rounded-full"
                          style={{ background: t.color }}
                          aria-hidden
                        />
                        <p className="text-sm leading-snug text-foreground/90">
                          {f.text}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </section>
  );
}
