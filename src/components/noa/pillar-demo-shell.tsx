"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DeepDiveTerrain } from "@/components/noa/deep-dive-terrain";
import { FindingsFeed } from "@/components/noa/findings-feed";
import { FlagsPanel } from "@/components/noa/flags-panel";
import { NoaTabs } from "@/components/noa/noa-tabs";
import { useAccentSentinel } from "@/components/noa/noa-demo-motion";
import { PillarOverviewContent } from "@/components/noa/pillar-overview";
import { PillarStickyHeader } from "@/components/noa/pillar-sticky-header";
import {
  randomizeDemoPillars,
  randomizeMetricCards,
  randomSeverityRoll,
} from "@/lib/noa-demo-random";
import { getMetrics } from "@/lib/noa-data";
import type {
  Finding,
  FlagItem,
  MetricCard,
  PillarId,
  PillarMeta,
  SeveritySnap,
} from "@/lib/noa-types";

export function PillarDemoShell({
  pillarId,
  initialPillars,
  initialMetrics,
  initialSnap,
  findings,
  flags,
  pillarIndexDisplay,
}: {
  pillarId: PillarId;
  initialPillars: PillarMeta[];
  initialMetrics: MetricCard[];
  initialSnap: SeveritySnap;
  findings: Finding[];
  flags: FlagItem[];
  pillarIndexDisplay: string;
}) {
  const [pillars, setPillars] = useState(initialPillars);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [snap, setSnap] = useState(initialSnap);

  const pillar = useMemo(
    () => pillars.find((p) => p.id === pillarId)!,
    [pillars, pillarId]
  );

  const reroll = useCallback(() => {
    setPillars(randomizeDemoPillars());
    setMetrics(randomizeMetricCards(getMetrics(pillarId)));
    setSnap(randomSeverityRoll(findings.length));
  }, [pillarId, findings.length]);

  const sentinelRef = useAccentSentinel(reroll);

  return (
    <div>
      <span
        ref={sentinelRef}
        className="noa-accent-demo-sentinel pointer-events-none fixed left-0 top-[72px] z-[35] size-px opacity-0"
        aria-hidden
      />

      <PillarStickyHeader pillar={pillar} allPillars={pillars} />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Executive Summary
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pillar.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Pillar P{pillarIndexDisplay} · case file
          </span>
        </div>

        <NoaTabs
          defaultValue="overview"
          tabs={[
            {
              id: "overview",
              label: "Overview",
              index: "01",
              trailing: (
                <span className="noa-mono rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                  {metrics.length} signals
                </span>
              ),
              content: (
                <PillarOverviewContent
                  pillar={pillar}
                  metrics={metrics}
                  severitySnap={snap}
                />
              ),
            },
            {
              id: "findings",
              label: "Findings",
              index: "02",
              trailing: (
                <span className="noa-mono rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                  {findings.length}
                </span>
              ),
              content: <FindingsFeed findings={findings} />,
            },
            {
              id: "deep-dive",
              label: "Deep dive",
              index: "03",
              content: (
                <DeepDiveTerrain
                  techDebt={pillar.techDebt}
                  scalability={pillar.scalability}
                />
              ),
            },
            {
              id: "flags",
              label: "Flags",
              index: "04",
              trailing: (
                <span className="noa-mono rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                  {flags.length}
                </span>
              ),
              content: (
                <FlagsPanel
                  flags={flags}
                  title="Pillar flags"
                  subtitle="Same three-tier structure as the executive memo — scoped to this pillar only."
                  index="04"
                />
              ),
            },
          ]}
        />
      </main>
    </div>
  );
}
