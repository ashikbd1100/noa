"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InlineSeverityBar } from "@/components/noa/inline-severity-bar";
import { SeverityDot, severityTierGlyph } from "@/components/noa/severity-dot";
import type { Finding, SeverityTier } from "@/lib/noa-types";
import { cn } from "@/lib/utils";

const tiers: (SeverityTier | "all")[] = ["all", "red", "yellow", "green"];

export function FindingsFeed({ findings }: { findings: Finding[] }) {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<(typeof tiers)[number]>("all");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const f of findings) s.add(f.category);
    return ["all", ...Array.from(s).sort()];
  }, [findings]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return findings.filter((f) => {
      if (tier !== "all" && f.severity !== tier) return false;
      if (cat !== "all" && f.category !== cat) return false;
      if (!needle) return true;
      return (
        f.title.toLowerCase().includes(needle) ||
        f.category.toLowerCase().includes(needle) ||
        f.detail.toLowerCase().includes(needle)
      );
    });
  }, [findings, q, tier, cat]);

  return (
    <section className="rounded-lg border border-white/10 bg-[var(--noa-panel)]">
      <header className="border-b border-white/[0.06] px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1">
            <p className="noa-eyebrow">04 / Findings feed</p>
            <h2 className="noa-display mt-2 text-lg font-semibold tracking-tight">
              Ranked by severity{" "}
              <span className="text-muted-foreground">— Red first</span>
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
              Expand a row for what was detected, why it matters, and the
              recommended remediation path. Source tag distinguishes
              auto-generated from analyst-validated.
            </p>

            {/* Severity tabs sit directly under the title (control matches the headline) */}
            <div className="mt-4">
              <p className="noa-eyebrow mb-2">Severity</p>
              <Tabs
                value={tier}
                onValueChange={(v) => setTier(v as (typeof tiers)[number])}
                className="w-full max-w-full"
              >
                <TabsList
                  variant="nav"
                  className="h-auto min-h-9 w-full max-w-full flex-nowrap justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:inline-flex sm:w-auto"
                >
                  {tiers.map((t) => (
                    <TabsTrigger key={t} value={t}>
                      <span className="relative">{t}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-72">
            <p className="noa-eyebrow mb-2 lg:text-right">Search</p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search findings…"
                className="h-9 rounded-sm border-white/10 bg-black/60 pl-8 text-xs noa-mono tracking-wider"
                aria-label="Search findings"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-2 border-b border-white/[0.06] px-5 py-3">
        <p className="noa-eyebrow">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "noa-mono rounded-sm border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                cat === c
                  ? "border-[var(--noa-violet)]/60 bg-[var(--noa-violet)]/15 text-foreground"
                  : "border-white/10 bg-black/40 text-muted-foreground hover:border-white/20 hover:text-foreground"
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[min(72vh,760px)] overflow-y-auto overscroll-contain">
        <Accordion multiple={false} defaultValue={[]} className="px-2 pb-3 pt-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              No findings match the current filters.
            </p>
          ) : (
            filtered.map((f, i) => {
              const isAnalyst = f.source === "analyst";
              return (
                <AccordionItem
                  key={f.id}
                  value={f.id}
                  className="border-b border-white/[0.06] last:border-b-0"
                >
                  <AccordionTrigger className="rounded-none px-3 py-3.5 hover:no-underline data-[state=open]:bg-white/[0.025]">
                    <div className="flex w-full min-w-0 items-center gap-4 pr-1 text-left">
                      <span className="noa-mono w-12 shrink-0 text-[10px] uppercase tracking-[0.16em] text-white/30">
                        {String(i + 1).padStart(3, "0")}
                      </span>

                      <span className="flex w-6 shrink-0 items-center justify-center">
                        <SeverityDot tier={f.severity} pulse={f.severity === "red"} />
                      </span>

                      <span
                        className={cn(
                          "noa-mono shrink-0 rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em]",
                          f.severity === "red"
                            ? "border-[var(--noa-severity-red)]/40 text-[var(--noa-severity-red)]"
                            : f.severity === "yellow"
                              ? "border-[var(--noa-severity-yellow)]/40 text-[var(--noa-severity-yellow)]"
                              : "border-[var(--noa-severity-green)]/40 text-[var(--noa-severity-green)]"
                        )}
                      >
                        {severityTierGlyph(f.severity)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-foreground">
                          {f.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="noa-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {f.category}
                          </span>
                          <span className="size-0.5 rounded-full bg-white/20" />
                          <span
                            className={cn(
                              "noa-mono inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em]",
                              isAnalyst
                                ? "text-[oklch(0.85_0.1_290)]"
                                : "text-muted-foreground"
                            )}
                          >
                            {isAnalyst ? (
                              <>
                                <span className="size-1 rounded-full bg-[var(--noa-violet)]" />
                                Analyst input
                                <span className="text-white/30">
                                  · human in the loop
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="size-1 rounded-full bg-white/30" />
                                Auto-generated
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="hidden shrink-0 items-center sm:flex">
                        <InlineSeverityBar
                          severity={f.severity}
                          score={f.severityScore}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-4">
                    <div
                      className={cn(
                        "rounded-md border bg-black/40 p-4",
                        isAnalyst
                          ? "border-[var(--noa-violet)]/35"
                          : "border-white/10"
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="noa-mono rounded-sm border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          ID · {f.id.toUpperCase()}
                        </span>
                        {isAnalyst ? (
                          <span className="noa-mono inline-flex items-center gap-1 rounded-sm border border-[var(--noa-violet)]/55 bg-[var(--noa-violet)]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-foreground">
                            <span className="size-1 rounded-full bg-[var(--noa-violet)]" />
                            Analyst-validated
                          </span>
                        ) : null}
                        <InlineSeverityBar
                          severity={f.severity}
                          score={f.severityScore}
                          className="sm:hidden"
                        />
                      </div>

                      <div className="mt-4 grid gap-5 md:grid-cols-2">
                        <div>
                          <p className="noa-eyebrow">What was detected</p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                            {f.detail}
                          </p>
                        </div>
                        <div>
                          <p className="noa-eyebrow">Recommended action</p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                            {f.remediation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })
          )}
        </Accordion>
      </div>
    </section>
  );
}
