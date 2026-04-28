import Link from "next/link";
import { notFound } from "next/navigation";
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
import { MetricSparkCards } from "@/components/noa/metric-spark-cards";
import { PillarHeroBlock } from "@/components/noa/pillar-hero";
import { PillarStickyHeader } from "@/components/noa/pillar-sticky-header";
import { SectionHeader } from "@/components/noa/section-header";
import {
  getFindings,
  getMetrics,
  getPillar,
  getPillarFlags,
  PILLARS,
} from "@/lib/noa-data";
import type { PillarId } from "@/lib/noa-types";

const IDS: PillarId[] = [
  "applications",
  "cloud-infra",
  "architecture",
  "security",
  "personnel",
];

export function generateStaticParams() {
  return IDS.map((pillarId) => ({ pillarId }));
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillarId: string }>;
}) {
  const { pillarId } = await params;
  if (!IDS.includes(pillarId as PillarId)) notFound();

  const id = pillarId as PillarId;
  const pillar = getPillar(id);
  if (!pillar) notFound();

  const findings = getFindings(id);
  const metrics = getMetrics(id);
  const flags = getPillarFlags(id);
  const pillarIndex =
    String(IDS.indexOf(id) + 1).padStart(2, "0");

  return (
    <div>
      <PillarStickyHeader pillar={pillar} allPillars={PILLARS} />

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
            Pillar P{pillarIndex} · case file
          </span>
        </div>

        <div className="space-y-12">
          <section>
            <SectionHeader
              index={`P${pillarIndex}`}
              eyebrow="Pillar overview"
              title={
                <>
                  {pillar.label}
                  <span className="text-muted-foreground"> — read the case.</span>
                </>
              }
              description="Score, delta, color band, and the inverse tension axis at full visual weight. This is where the analytical depth lives."
            />
            <div className="mt-6">
              <PillarHeroBlock pillar={pillar} />
            </div>
          </section>

          <section>
            <SectionHeader
              index="03"
              eyebrow="Top signals"
              title="Quantitative pulse for this pillar"
              description="Compact metric cards with embedded micro-trends — border elevation, no drop shadows, tuned for dense dark surfaces."
            />
            <div className="mt-6">
              <MetricSparkCards metrics={metrics} />
            </div>
          </section>

          <FindingsFeed findings={findings} />

          <DeepDiveTerrain
            techDebt={pillar.techDebt}
            scalability={pillar.scalability}
          />

          <FlagsPanel
            flags={flags}
            title="Pillar flags"
            subtitle="Same three-tier structure as the executive memo — scoped to this pillar only."
            index="07"
          />
        </div>
      </main>
    </div>
  );
}
