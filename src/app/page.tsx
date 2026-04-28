import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DebtScalabilityTension } from "@/components/noa/debt-scalability-tension";
import { FlagsPanel } from "@/components/noa/flags-panel";
import { ScoreDelta } from "@/components/noa/score-delta";
import { ViabilityGauge } from "@/components/noa/viability-gauge";
import { BandBadge } from "@/components/noa/band-badge";
import { Panel } from "@/components/noa/panel";
import { SectionHeader } from "@/components/noa/section-header";
import { RibbonBackdrop } from "@/components/noa/ribbon-backdrop";
import {
  getExecutiveFlags,
  getExecutiveSummary,
  PILLARS,
  TARGET_COMPANY,
} from "@/lib/noa-data";
import { cn } from "@/lib/utils";

const bandAccent: Record<string, string> = {
  red: "var(--noa-severity-red)",
  yellow: "var(--noa-severity-yellow)",
  green: "var(--noa-severity-green)",
};

export default function ExecutiveSummaryPage() {
  const exec = getExecutiveSummary();
  const flags = getExecutiveFlags();
  const counts = {
    red: flags.filter((f) => f.tier === "red").length,
    yellow: flags.filter((f) => f.tier === "yellow").length,
    green: flags.filter((f) => f.tier === "green").length,
  };

  return (
    <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      {/* TOP META BAR */}
      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="noa-eyebrow flex items-center gap-2">
            <span className="size-1 rounded-full bg-[var(--noa-cyan)] noa-motion-pulse" />
            <span>01 / Executive summary &amp; scorecard</span>
          </p>
          <h1 className="noa-display mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Verdict before <span className="text-muted-foreground">the case file.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Composite viability, pillar roll-ups, inverse tech-debt vs.
            scalability tension, and a memo-style flags ledger. Engineered for a
            $50M decision, not a glance.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <p className="noa-eyebrow">Target</p>
          <p className="noa-display text-base font-semibold text-foreground">
            {TARGET_COMPANY}
          </p>
          <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Assessment · 2026 Q2
          </span>
        </div>
      </div>

      {/* HERO */}
      <Panel
        tone="glass-strong"
        brackets
        className="relative mb-12 overflow-hidden noa-ambient-glow"
      >
        <RibbonBackdrop />
        <div
          className="pointer-events-none absolute inset-0 noa-mesh"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 -top-32 size-96 rounded-full bg-[oklch(0.62_0.22_290/0.18)] blur-3xl noa-motion-ambient"
          aria-hidden
        />

        <div className="relative grid gap-10 p-8 lg:grid-cols-[1.1fr_1px_0.9fr] lg:items-center lg:p-10">
          {/* LEFT — gauge */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex w-full items-center justify-between gap-2">
              <span className="noa-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Composite viability · avg. of 5 pillars
              </span>
              <ScoreDelta
                current={exec.overallScore}
                prior={exec.priorScore}
              />
            </div>
            <ViabilityGauge
              score={exec.overallScore}
              size="lg"
              label="Overall viability"
            />
            <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-muted-foreground">
              {exec.contextLine}
            </p>
          </div>

          <span className="hidden h-full w-px bg-white/[0.06] lg:block" aria-hidden />

          {/* RIGHT — macro tension + flag KPIs */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="noa-eyebrow">02 / Macro tension</p>
              <h2 className="noa-display mt-2 text-lg font-semibold tracking-tight">
                Tech debt vs. scalability
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Same inverse relationship surfaced at portfolio level — a
                secondary insight beneath the gauge.
              </p>
            </div>
            <DebtScalabilityTension
              techDebt={exec.macroTechDebt}
              scalability={exec.macroScalability}
            />

            <div className="noa-hr-soft" />

            <div className="grid grid-cols-3 gap-3">
              <FlagKpi label="Red" count={counts.red} color="var(--noa-severity-red)" />
              <FlagKpi
                label="Yellow"
                count={counts.yellow}
                color="var(--noa-severity-yellow)"
              />
              <FlagKpi
                label="Green"
                count={counts.green}
                color="var(--noa-severity-green)"
              />
            </div>

            <div className="rounded-sm border border-white/[0.06] bg-black/30 p-3">
              <p className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Reading frame
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/85">
                Each pillar below mirrors the credit-factor card logic: metric,
                influence on the composite, one-line descriptor, and a tension
                axis that makes the trade-off visually intuitive before you
                drill in.
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* PILLAR SCORECARDS */}
      <SectionHeader
        index="03"
        eyebrow="Pillar scorecards"
        title={
          <>
            Five pillars,
            <span className="text-muted-foreground"> one decision instrument.</span>
          </>
        }
        description="Click through for the full case file — findings feed, deep dive, and pillar-level flags."
        trailing={
          <span className="noa-mono hidden items-center gap-2 rounded-sm border border-white/10 bg-black/40 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline-flex">
            <span className="size-1 rounded-full bg-[var(--noa-violet)]" />
            5 of 5 reporting
          </span>
        }
      />

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {PILLARS.map((p, i) => {
          const accent = bandAccent[p.colorBand] ?? "var(--noa-cyan)";
          return (
            <Link
              key={p.id}
              href={`/pillar/${p.id}`}
              className="group block focus-visible:outline-none"
            >
              <Panel
                tone="panel"
                brackets
                className="relative h-full overflow-hidden p-5 transition-colors hover:bg-[oklch(0.085_0.014_270)]"
              >
                <div
                  className="absolute left-0 top-0 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, ${accent} 0%, transparent 60%)`,
                    opacity: 0.6,
                  }}
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="noa-eyebrow flex items-center gap-2">
                      <span className="text-foreground/70">
                        P{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white/20">/</span>
                      <span>{p.label}</span>
                    </p>
                    <h3 className="noa-display mt-2 text-lg font-semibold tracking-tight text-foreground">
                      {p.label}
                    </h3>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {p.summaryLine}
                </p>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="noa-eyebrow">Score</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="noa-display noa-tnum text-4xl font-semibold leading-none text-foreground">
                        {p.score}
                      </span>
                      <span className="noa-mono text-[10px] font-medium text-muted-foreground">
                        /100
                      </span>
                    </div>
                  </div>
                  <BandBadge band={p.colorBand} size="xs" />
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                  <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Influence
                  </span>
                  <span
                    className={cn(
                      "noa-mono text-[10px] uppercase tracking-[0.18em]",
                      p.impactWeight === "High"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {p.impactWeight}
                  </span>
                </div>

                <div className="mt-4">
                  <DebtScalabilityTension
                    techDebt={p.techDebt}
                    scalability={p.scalability}
                    dense
                  />
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>

      {/* FLAGS */}
      <div className="mt-12">
        <SectionHeader
          index="04"
          eyebrow="Flags ledger"
          title={
            <>
              The analyst memo,
              <span className="text-muted-foreground"> at a glance.</span>
            </>
          }
          description="Three tiers — short, declarative, ranked by severity. Filterable and collapsible."
        />
        <div className="mt-6">
          <FlagsPanel flags={flags} index="04" />
        </div>
      </div>
    </main>
  );
}

function FlagKpi({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-sm border border-white/[0.06] bg-black/30 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span
          className="size-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
          aria-hidden
        />
        <span className="noa-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="noa-display noa-tnum mt-1.5 text-xl font-semibold text-foreground">
        {String(count).padStart(2, "0")}
      </p>
    </div>
  );
}
