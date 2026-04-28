import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DebtScalabilityTension } from "@/components/noa/debt-scalability-tension";
import { FlagsPanel } from "@/components/noa/flags-panel";
import { NoaTabs } from "@/components/noa/noa-tabs";
import { ScoreDelta } from "@/components/noa/score-delta";
import { ViabilityGauge } from "@/components/noa/viability-gauge";
import { BandBadge } from "@/components/noa/band-badge";
import { Panel, PanelHeader } from "@/components/noa/panel";
import { RibbonBackdrop } from "@/components/noa/ribbon-backdrop";
import {
  getExecutiveFlags,
  getExecutiveSummary,
  PILLARS,
  TARGET_COMPANY,
} from "@/lib/noa-data";
import type { FlagItem } from "@/lib/noa-types";
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
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="noa-eyebrow flex items-center gap-2">
            <span className="size-1 rounded-full bg-[var(--noa-cyan)] noa-motion-pulse" />
            <span>Executive summary &amp; scorecard</span>
          </p>
          <h1 className="noa-display mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Verdict before{" "}
            <span className="text-muted-foreground">the case file.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Composite viability, pillar roll-ups, inverse tech-debt vs.
            scalability tension, and a memo-style flags ledger.
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5 lg:items-end">
          <p className="noa-eyebrow">Target</p>
          <p className="noa-display text-base font-semibold text-foreground">
            {TARGET_COMPANY}
          </p>
          <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Assessment · 2026 Q2
          </span>
        </div>
      </div>

      <NoaTabs
        defaultValue="overview"
        tabs={[
          {
            id: "overview",
            label: "Overview",
            index: "01",
            content: (
              <OverviewPanel exec={exec} counts={counts} flags={flags} />
            ),
          },
          {
            id: "pillars",
            label: "Pillars",
            index: "02",
            trailing: (
              <span className="noa-mono rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                {PILLARS.length}
              </span>
            ),
            content: <PillarsGrid />,
          },
          {
            id: "flags",
            label: "Flags",
            index: "03",
            trailing: (
              <span className="noa-mono rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                {flags.length}
              </span>
            ),
            content: (
              <FlagsPanel flags={flags} index="03" />
            ),
          },
        ]}
      />
    </main>
  );
}

function OverviewPanel({
  exec,
  counts,
  flags,
}: {
  exec: ReturnType<typeof getExecutiveSummary>;
  counts: { red: number; yellow: number; green: number };
  flags: FlagItem[];
}) {
  const byScore = [...PILLARS].sort((a, b) => b.score - a.score);
  const strongest = byScore[0];
  const weakest = byScore[byScore.length - 1];
  const spread = strongest.score - weakest.score;
  const highInfl = PILLARS.filter((p) => p.impactWeight === "High").length;
  const tierOrder = { red: 0, yellow: 1, green: 2 } as const;
  const watchlist = [...flags]
    .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
    .slice(0, 4);

  return (
    <div className="space-y-8">
    <Panel
      tone="glass-strong"
      brackets
      className="relative overflow-hidden noa-ambient-glow"
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

        <span
          className="hidden h-full w-px bg-white/[0.06] lg:block"
          aria-hidden
        />

        {/* RIGHT — macro tension + flag KPIs */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="noa-eyebrow">Macro tension</p>
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

          <div className="rounded-sm border border-white/[0.06] bg-black/30 p-3">
            <p className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Reading frame
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/85">
              Each pillar mirrors the credit-factor card logic: metric,
              influence on the composite, one-line descriptor, and a tension
              axis that makes the trade-off visually intuitive before you drill
              in.
            </p>
          </div>
        </div>
      </div>
    </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* CONVICTION MAP — KPI strip */}
        <Panel tone="panel" brackets className="relative p-0 noa-row-hover">
          <PanelHeader
            eyebrow="Portfolio snapshot"
            title="Conviction map"
            description="Where the book is strongest, where it frays, and how wide dispersion runs."
            className="border-white/[0.06] px-5 py-4 sm:px-6"
            trailing={
              <span className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {PILLARS.length} pillars
              </span>
            }
          />
          <dl className="grid grid-cols-2 divide-x divide-y divide-white/[0.05] border-t border-white/[0.05]">
            <SnapshotStat
              label="Strongest"
              primary={strongest.score}
              unit="/100"
              caption={strongest.label}
              band={strongest.colorBand}
              fill={strongest.score}
            />
            <SnapshotStat
              label="Weakest"
              primary={weakest.score}
              unit="/100"
              caption={weakest.label}
              band={weakest.colorBand}
              fill={weakest.score}
            />
            <SnapshotStat
              label="Spread"
              primary={spread}
              unit="pts"
              caption={`${weakest.shortLabel} → ${strongest.shortLabel}`}
              fill={Math.min(100, spread * 4)}
              tone="neutral"
            />
            <SnapshotStat
              label="High influence"
              primary={highInfl}
              unit={`/ ${PILLARS.length}`}
              caption="Weighted in IC narrative"
              fill={(highInfl / PILLARS.length) * 100}
              tone="neutral"
            />
          </dl>
        </Panel>

        {/* PARTNER MEMO QUEUE — actionable list */}
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
                <p className="flex-1 text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/90">
                  {f.text}
                </p>
              </li>
            ))}
          </ol>
          <div className="flex items-center justify-between border-t border-white/[0.05] px-5 py-3 sm:px-6">
            <span className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Showing {watchlist.length} of {flags.length}
            </span>
            <span className="noa-mono inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-foreground/80">
              Open ledger
              <ArrowUpRight className="size-3" aria-hidden />
            </span>
          </div>
        </Panel>
      </div>

      {/* LANE PRESSURE — pillar table-strip */}
      <Panel tone="panel" brackets className="relative p-0 noa-row-hover">
        <PanelHeader
          eyebrow="Pillar heat snapshot"
          title="Lane pressure"
          description="Score, delta vs prior run, and fill to par — click through for the full case file."
          className="border-white/[0.06] px-5 py-4 sm:px-6"
          trailing={
            <span className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {PILLARS.length} lanes
            </span>
          }
        />
        <ul className="divide-y divide-white/[0.05] border-t border-white/[0.05]">
          {PILLARS.map((p, i) => {
            const accent = bandAccent[p.colorBand] ?? "var(--noa-cyan)";
            return (
              <li key={p.id}>
                <Link
                  href={`/pillar/${p.id}`}
                  className={cn(
                    "group grid grid-cols-[2.5rem_1fr_4rem_5rem_1fr_auto] items-center gap-4 px-5 py-3 transition-colors sm:px-6",
                    "hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--noa-violet)]/40"
                  )}
                >
                  <span className="noa-mono text-[10px] tabular-nums text-muted-foreground/70">
                    P{String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="truncate text-sm font-medium text-foreground">
                    {p.shortLabel}
                  </p>
                  <span className="noa-display noa-tnum text-base font-semibold tabular-nums text-foreground">
                    {p.score}
                    <span className="noa-mono ml-0.5 text-[10px] font-medium text-muted-foreground">
                      /100
                    </span>
                  </span>
                  <ScoreDelta
                    current={p.score}
                    prior={p.priorScore}
                    compact
                    className="shrink-0 border-white/[0.08] bg-black/30 px-1.5 py-0.5 text-[9px]"
                  />
                  <div
                    className="relative h-1 overflow-hidden rounded-full bg-white/[0.06]"
                    aria-hidden
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.score}%`,
                        background: accent,
                      }}
                    />
                  </div>
                  <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
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
  const barColor =
    tone === "neutral"
      ? "var(--noa-cyan)"
      : band
        ? bandAccent[band]
        : "var(--noa-cyan)";
  return (
    <div className="space-y-2 px-5 py-4 sm:px-6">
      <dt className="flex items-center justify-between gap-2">
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
      </dt>
      <dd className="space-y-2">
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
        <p className="truncate text-[11px] leading-snug text-muted-foreground">
          {caption}
        </p>
        <div
          className="relative h-0.5 overflow-hidden rounded-full bg-white/[0.05]"
          aria-hidden
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(0, Math.min(100, fill))}%`,
              background: barColor,
            }}
          />
        </div>
      </dd>
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

function PillarsGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
