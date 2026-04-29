"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { DebtScalabilityTension } from "@/components/noa/debt-scalability-tension";
import {
  AnimatedDigits,
  useAccentSentinel,
  useAnimatedNumber,
} from "@/components/noa/noa-demo-motion";
import { ScoreDelta } from "@/components/noa/score-delta";
import { ViabilityGauge } from "@/components/noa/viability-gauge";
import { InlineCopyLine } from "@/components/noa/inline-copy-line";
import { Panel, PanelHeader } from "@/components/noa/panel";
import { randomizeDemoPillars } from "@/lib/noa-demo-random";
import { buildExecutiveSummary } from "@/lib/noa-executive-summary";
import type { FlagItem } from "@/lib/noa-types";
import type { PillarMeta } from "@/lib/noa-types";
import { cn } from "@/lib/utils";

const bandAccent: Record<string, string> = {
  red: "var(--noa-severity-red)",
  yellow: "var(--noa-severity-yellow)",
  green: "var(--noa-severity-green)",
};

export function OverviewPanel({
  initialPillars,
  counts,
  flags,
}: {
  initialPillars: PillarMeta[];
  counts: { red: number; yellow: number; green: number };
  flags: FlagItem[];
}) {
  const [pillars, setPillars] = useState(initialPillars);
  const exec = useMemo(() => buildExecutiveSummary(pillars), [pillars]);

  const animOverall = useAnimatedNumber(exec.overallScore);
  const animPrior = useAnimatedNumber(exec.priorScore);
  const animDebt = useAnimatedNumber(exec.macroTechDebt);
  const animScale = useAnimatedNumber(exec.macroScalability);

  const onAccentCycle = useCallback(() => {
    setPillars(randomizeDemoPillars());
  }, []);

  const sentinelRef = useAccentSentinel(onAccentCycle);

  const byScore = [...pillars].sort((a, b) => b.score - a.score);
  const strongest = byScore[0];
  const weakest = byScore[byScore.length - 1];
  const spread = strongest.score - weakest.score;
  const highInfl = pillars.filter((p) => p.impactWeight === "High").length;
  const tierOrder = { red: 0, yellow: 1, green: 2 } as const;
  const watchlist = [...flags]
    .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-md p-px noa-accent-frame-ring">
        <span
          ref={sentinelRef}
          className="noa-accent-demo-sentinel pointer-events-none absolute left-0 top-0 z-[3] size-px opacity-0"
          aria-hidden
        />
        <Panel
          tone="glass-strong"
          brackets={false}
          className="relative overflow-hidden rounded-[calc(var(--radius-md)-1px)]"
        >
          <div
            className="pointer-events-none absolute inset-0 noa-mesh opacity-[0.18]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-14 -top-20 size-[17rem] rounded-full bg-[oklch(0.62_0.22_290/0.06)] blur-3xl noa-motion-ambient"
            aria-hidden
          />

          <div className="relative grid gap-11 px-8 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start lg:gap-x-14 lg:gap-y-10 lg:px-11 lg:py-12 xl:px-14 xl:py-[3.25rem]">
            <div className="flex flex-col items-center gap-8 lg:items-stretch">
              <div className="flex w-full max-w-[300px] flex-col gap-4 sm:mx-auto sm:max-w-none sm:flex-row sm:items-start sm:justify-between lg:mx-0 lg:max-w-none">
                <InlineCopyLine className="sm:flex-1">
                  <span className="noa-mono block text-[10px] uppercase tracking-[0.14em] text-white/38">
                    Composite viability · five pillars
                  </span>
                </InlineCopyLine>
                <ScoreDelta
                  current={animOverall}
                  prior={animPrior}
                  className="shrink-0 border-white/[0.06] bg-white/[0.025] backdrop-blur-sm sm:mt-0.5"
                />
              </div>
              <ViabilityGauge
                score={animOverall}
                size="lg"
                label="Overall viability"
              />
              <InlineCopyLine>
                <p className="mx-auto max-w-[26rem] text-center text-[13px] leading-relaxed tracking-[0.01em] text-muted-foreground transition-colors duration-500 sm:text-left lg:mx-0 lg:text-left">
                  {exec.contextLine}
                </p>
              </InlineCopyLine>
            </div>

            <div
              className="hidden min-h-[min(420px,70vh)] w-px shrink-0 self-stretch bg-gradient-to-b from-transparent via-white/[0.065] to-transparent lg:block"
              aria-hidden
            />

            <div className="flex flex-col gap-8 lg:min-w-0">
              <div className="space-y-2">
                <InlineCopyLine>
                  <p className="noa-mono text-[10px] uppercase tracking-[0.16em] text-white/34">
                    Macro tension
                  </p>
                </InlineCopyLine>
                <InlineCopyLine>
                  <h2 className="noa-display text-[17px] font-medium tracking-[-0.03em] text-foreground">
                    Tech debt vs. scalability
                  </h2>
                </InlineCopyLine>
                <InlineCopyLine>
                  <p className="max-w-md text-[13px] leading-[1.58] text-muted-foreground">
                    Portfolio-level inverse tension — same trade-off lens as each
                    pillar, without leaving the executive frame.
                  </p>
                </InlineCopyLine>
              </div>
              <DebtScalabilityTension
                techDebt={animDebt}
                scalability={animScale}
              />

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <div className="grid grid-cols-3 gap-2">
                <FlagKpi
                  label="Red"
                  count={counts.red}
                  color="var(--noa-severity-red)"
                />
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

              <div className="border-l border-white/[0.07] pl-5 pt-0.5">
                <InlineCopyLine>
                  <p className="noa-mono text-[10px] uppercase tracking-[0.14em] text-white/28">
                    Reading frame
                  </p>
                </InlineCopyLine>
                <InlineCopyLine>
                  <p className="mt-2 text-[12px] leading-[1.62] text-foreground/72">
                    Each pillar mirrors the credit-factor pattern — metric,
                    influence on the composite, tension axis — before you drill into
                    the lane file.
                  </p>
                </InlineCopyLine>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel tone="panel" brackets className="relative p-0 noa-row-hover">
          <PanelHeader
            eyebrow="Portfolio snapshot"
            title="Conviction map"
            description="Where the book is strongest, where it frays, and how wide dispersion runs."
            className="border-white/[0.06] px-5 py-4 sm:px-6"
            trailing={
              <span className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {pillars.length} pillars
              </span>
            }
          />
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.05] border-t border-white/[0.05]">
            <SnapshotStat
              label="Strongest"
              primary={<AnimatedDigits value={strongest.score} />}
              unit="/100"
              caption={strongest.label}
              band={strongest.colorBand}
              fill={strongest.score}
            />
            <SnapshotStat
              label="Weakest"
              primary={<AnimatedDigits value={weakest.score} />}
              unit="/100"
              caption={weakest.label}
              band={weakest.colorBand}
              fill={weakest.score}
            />
            <SnapshotStat
              label="Spread"
              primary={<AnimatedDigits value={spread} />}
              unit="pts"
              caption={`${weakest.shortLabel} → ${strongest.shortLabel}`}
              fill={Math.min(100, spread * 4)}
              tone="neutral"
            />
            <SnapshotStat
              label="High influence"
              primary={<AnimatedDigits value={highInfl} />}
              unit={`/ ${pillars.length}`}
              caption="Weighted in IC narrative"
              fill={(highInfl / pillars.length) * 100}
              tone="neutral"
            />
          </div>
        </Panel>

        <Panel tone="panel" brackets className="relative p-0 noa-row-hover">
          <PanelHeader
            eyebrow="Material watchlist"
            title="Partner memo queue"
            description="Top flags by materiality — full ledger sits in the Flags tab."
            className="border-white/[0.06] px-5 py-4 sm:px-6"
            trailing={
              <div className="noa-mono flex items-center gap-1 text-[10px] tabular-nums">
                <TierCount tier="red" count={counts.red} />
                <TierCount tier="yellow" count={counts.yellow} />
                <TierCount tier="green" count={counts.green} />
              </div>
            }
          />
          <ol className="divide-y divide-white/[0.05] border-t border-white/[0.05]">
            {watchlist.map((f, idx) => (
              <li
                key={f.id}
                className="group flex items-start gap-3 px-5 py-3 transition-colors hover:bg-white/[0.015] sm:px-6"
              >
                <span className="noa-mono mt-0.5 w-5 shrink-0 text-[10px] tabular-nums text-muted-foreground/70">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <TierTag tier={f.tier} />
                <InlineCopyLine className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/90">
                    {f.text}
                  </p>
                </InlineCopyLine>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-1 border-t border-white/[0.05] px-5 py-3 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
            <InlineCopyLine>
              <span className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Showing {watchlist.length} of {flags.length}
              </span>
            </InlineCopyLine>
            <InlineCopyLine>
              <span className="noa-mono inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-foreground/80">
                Open ledger
                <ArrowUpRight className="size-3" aria-hidden />
              </span>
            </InlineCopyLine>
          </div>
        </Panel>
      </div>

      <Panel tone="panel" brackets className="relative p-0 noa-row-hover">
        <PanelHeader
          eyebrow="Pillar heat snapshot"
          title="Lane pressure"
          description="Score, delta vs prior run, and fill to par — click through for the full case file."
          className="border-white/[0.06] px-5 py-4 sm:px-6"
          trailing={
            <span className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {pillars.length} lanes
            </span>
          }
        />
        <ul className="divide-y divide-white/[0.05] border-t border-white/[0.05]">
          {pillars.map((p, i) => (
            <LanePressureRow key={p.id} pillar={p} index={i} />
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function LanePressureRow({ pillar, index }: { pillar: PillarMeta; index: number }) {
  const accent = bandAccent[pillar.colorBand] ?? "var(--noa-cyan)";
  const animScore = useAnimatedNumber(pillar.score);
  const animPrior = useAnimatedNumber(pillar.priorScore);

  return (
    <li>
      <Link
        href={`/pillar/${pillar.id}`}
        className={cn(
          "group grid grid-cols-[2.5rem_1fr_4rem_5rem_1fr_auto] items-center gap-4 px-5 py-3 transition-colors sm:px-6",
          "hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--noa-violet)]/40"
        )}
      >
        <InlineCopyLine>
          <span className="noa-mono text-[10px] tabular-nums text-muted-foreground/70">
            P{String(index + 1).padStart(2, "0")}
          </span>
        </InlineCopyLine>
        <InlineCopyLine className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {pillar.shortLabel}
          </p>
        </InlineCopyLine>
        <InlineCopyLine>
          <span className="noa-display noa-tnum text-base font-semibold tabular-nums text-foreground">
            {animScore}
            <span className="noa-mono ml-0.5 text-[10px] font-medium text-muted-foreground">
              /100
            </span>
          </span>
        </InlineCopyLine>
        <InlineCopyLine>
          <ScoreDelta
            current={animScore}
            prior={animPrior}
            compact
            className="shrink-0 border-white/[0.08] bg-black/30 px-1.5 py-0.5 text-[9px]"
          />
        </InlineCopyLine>
        <div
          className="relative h-1 overflow-hidden rounded-full bg-white/[0.06]"
          aria-hidden
        >
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${animScore}%`,
              background: accent,
            }}
          />
        </div>
        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>
    </li>
  );
}

function SnapshotStat({
  label,
  primary,
  unit,
  caption,
  band,
  fill,
  tone = "band",
}: {
  label: string;
  primary: ReactNode;
  unit?: string;
  caption: ReactNode;
  band?: "red" | "yellow" | "green";
  fill: number;
  tone?: "band" | "neutral";
}) {
  const fillAnim = useAnimatedNumber(fill);
  const barColor =
    tone === "neutral"
      ? "var(--noa-cyan)"
      : band
        ? bandAccent[band]
        : "var(--noa-cyan)";
  return (
    <div className="space-y-2 px-5 py-4 sm:px-6">
      <InlineCopyLine>
        <div className="flex items-center justify-between gap-2">
          <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
          {band ? (
            <span
              className="size-1.5 rounded-full"
              style={{ background: barColor }}
              aria-hidden
            />
          ) : null}
        </div>
      </InlineCopyLine>
      <InlineCopyLine>
        <p className="flex items-baseline gap-1">
          <span className="noa-display noa-tnum text-2xl font-semibold leading-none tabular-nums text-foreground">
            {primary}
          </span>
          {unit ? (
            <span className="noa-mono text-[10px] font-medium text-muted-foreground">
              {unit}
            </span>
          ) : null}
        </p>
      </InlineCopyLine>
      <InlineCopyLine>
        <p className="truncate text-[11px] leading-snug text-muted-foreground">
          {caption}
        </p>
      </InlineCopyLine>
      <div
        className="relative h-0.5 overflow-hidden rounded-full bg-white/[0.05]"
        aria-hidden
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.max(0, Math.min(100, fillAnim))}%`,
            background: barColor,
          }}
        />
      </div>
    </div>
  );
}

function TierTag({ tier }: { tier: "red" | "yellow" | "green" }) {
  const map = {
    red: { letter: "R", color: "var(--noa-severity-red)" },
    yellow: { letter: "Y", color: "var(--noa-severity-yellow)" },
    green: { letter: "G", color: "var(--noa-severity-green)" },
  } as const;
  const { letter, color } = map[tier];
  return (
    <span
      className="noa-mono mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-sm border text-[9px] font-semibold tabular-nums"
      style={{
        borderColor: `color-mix(in oklch, ${color} 40%, transparent)`,
        background: `color-mix(in oklch, ${color} 12%, transparent)`,
        color,
      }}
      aria-label={`Tier ${tier}`}
    >
      {letter}
    </span>
  );
}

function TierCount({
  tier,
  count,
}: {
  tier: "red" | "yellow" | "green";
  count: number;
}) {
  const color = bandAccent[tier];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-muted-foreground">
      <span
        className="size-1.5 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      <span className="tabular-nums text-foreground/85">
        {String(count).padStart(2, "0")}
      </span>
    </span>
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
    <div className="rounded-[6px] border border-white/[0.045] bg-white/[0.02] px-3 py-2.5 backdrop-blur-[6px]">
      <InlineCopyLine>
        <div className="flex items-center justify-between gap-2">
          <span
            className="size-1.5 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 8px ${color}66`,
            }}
            aria-hidden
          />
          <span className="noa-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
        </div>
      </InlineCopyLine>
      <InlineCopyLine>
        <p className="noa-display noa-tnum mt-1.5 text-xl font-semibold text-foreground">
          {String(count).padStart(2, "0")}
        </p>
      </InlineCopyLine>
    </div>
  );
}
