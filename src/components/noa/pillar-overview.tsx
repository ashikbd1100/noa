import { MetricSparkCards } from "@/components/noa/metric-spark-cards";
import { Panel } from "@/components/noa/panel";
import { PillarHeroBlock } from "@/components/noa/pillar-hero";
import type { Finding, MetricCard, PillarMeta } from "@/lib/noa-types";
import { cn } from "@/lib/utils";

export function PillarOverviewContent({
  pillar,
  metrics,
  findings,
}: {
  pillar: PillarMeta;
  metrics: MetricCard[];
  findings: Finding[];
}) {
  const red = findings.filter((f) => f.severity === "red").length;
  const yellow = findings.filter((f) => f.severity === "yellow").length;
  const green = findings.filter((f) => f.severity === "green").length;
  const analyst = findings.filter((f) => f.source === "analyst").length;

  return (
    <div className="space-y-8">
      <PillarHeroBlock pillar={pillar} />

      <section className="space-y-3">
        <div>
          <p className="noa-eyebrow">Findings snapshot</p>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Severity mix and human validation for this pillar — detail lives in
            the Findings tab.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotTile label="Total findings" value={String(findings.length)} />
          <SnapshotTile label="Red-tier" value={String(red)} accent="red" />
          <SnapshotTile label="Yellow-tier" value={String(yellow)} accent="yellow" />
          <SnapshotTile label="Analyst-validated" value={String(analyst)} />
        </div>
        <p className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Green-tier in feed:{" "}
          <span className="text-foreground/90 tabular-nums">{green}</span>
        </p>
      </section>

      <section className="space-y-3">
        <div>
          <p className="noa-eyebrow">Key quantitative signals</p>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Trailing sparklines on core quantitative signals for this lane.
          </p>
        </div>
        <MetricSparkCards metrics={metrics} />
      </section>
    </div>
  );
}

function SnapshotTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "red" | "yellow";
}) {
  return (
    <Panel tone="panel" brackets className="px-4 py-3 noa-row-hover">
      <div className="flex items-center justify-between gap-2">
        <span className="noa-eyebrow">{label}</span>
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            accent === "red"
              ? "bg-[var(--noa-severity-red)]"
              : accent === "yellow"
                ? "bg-[var(--noa-severity-yellow)]"
                : "bg-[var(--noa-cyan)]"
          )}
          aria-hidden
        />
      </div>
      <p className="noa-display noa-tnum mt-2 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </Panel>
  );
}
