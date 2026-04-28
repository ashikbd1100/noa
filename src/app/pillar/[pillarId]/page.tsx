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
import { NoaTabs } from "@/components/noa/noa-tabs";
import { PillarOverviewContent } from "@/components/noa/pillar-overview";
import { PillarStickyHeader } from "@/components/noa/pillar-sticky-header";
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
  const pillarIndex = String(IDS.indexOf(id) + 1).padStart(2, "0");

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
                  findings={findings}
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
