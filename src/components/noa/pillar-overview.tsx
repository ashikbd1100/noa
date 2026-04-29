"use client";

import type { ReactNode } from "react";
import { AnimatedDigits } from "@/components/noa/noa-demo-motion";
import { InlineCopyLine } from "@/components/noa/inline-copy-line";
import { MetricSparkCards } from "@/components/noa/metric-spark-cards";
import { Panel } from "@/components/noa/panel";
import { PillarHeroBlock } from "@/components/noa/pillar-hero";
import type {
  MetricCard,
  PillarMeta,
  SeveritySnap,
} from "@/lib/noa-types";
import { cn } from "@/lib/utils";

export function PillarOverviewContent({
  pillar,
  metrics,
  severitySnap,
}: {
  pillar: PillarMeta;
  metrics: MetricCard[];
  severitySnap: SeveritySnap;
}) {
  const { red, yellow, green, analyst } = severitySnap;

  return (
    <div className="space-y-8">
      <PillarHeroBlock pillar={pillar} />

      <section className="space-y-3">
        <div className="space-y-2">
          <InlineCopyLine>
            <p className="noa-eyebrow">Findings snapshot</p>
          </InlineCopyLine>
          <InlineCopyLine>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              Severity mix and human validation for this pillar — detail lives in
              the Findings tab.
            </p>
          </InlineCopyLine>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SnapshotTile
            label="Total findings"
            value={<AnimatedDigits value={severitySnap.total} />}
          />
          <SnapshotTile
            label="Red-tier"
            value={<AnimatedDigits value={red} />}
            accent="red"
          />
          <SnapshotTile
            label="Yellow-tier"
            value={<AnimatedDigits value={yellow} />}
            accent="yellow"
          />
          <SnapshotTile
            label="Analyst-validated"
            value={<AnimatedDigits value={analyst} />}
          />
        </div>
        <InlineCopyLine>
          <p className="noa-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Green-tier in feed:{" "}
            <span className="text-foreground/90 tabular-nums">
              <AnimatedDigits value={green} />
            </span>
          </p>
        </InlineCopyLine>
      </section>

      <section className="space-y-3">
        <div className="space-y-2">
          <InlineCopyLine>
            <p className="noa-eyebrow">Key quantitative signals</p>
          </InlineCopyLine>
          <InlineCopyLine>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
              Trailing sparklines on core quantitative signals for this lane.
            </p>
          </InlineCopyLine>
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
  value: ReactNode;
  accent?: "red" | "yellow";
}) {
  return (
    <Panel tone="panel" brackets className="px-4 py-3 noa-row-hover">
      <InlineCopyLine>
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
      </InlineCopyLine>
      <InlineCopyLine>
        <p className="noa-display noa-tnum mt-2 text-2xl font-semibold tabular-nums text-foreground">
          {value}
        </p>
      </InlineCopyLine>
    </Panel>
  );
}
