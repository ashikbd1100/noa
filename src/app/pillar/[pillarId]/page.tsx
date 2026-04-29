import { notFound } from "next/navigation";
import { PillarDemoShell } from "@/components/noa/pillar-demo-shell";
import {
  getDemoPillarsForRequest,
  getFindings,
  getMetrics,
  getPillarFlags,
} from "@/lib/noa-data";
import type { Finding, PillarId, SeveritySnap } from "@/lib/noa-types";

export const dynamic = "force-dynamic";

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

function severitySnapFromFindings(findings: Finding[]): SeveritySnap {
  return {
    red: findings.filter((f) => f.severity === "red").length,
    yellow: findings.filter((f) => f.severity === "yellow").length,
    green: findings.filter((f) => f.severity === "green").length,
    analyst: findings.filter((f) => f.source === "analyst").length,
    total: findings.length,
  };
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillarId: string }>;
}) {
  const { pillarId } = await params;
  if (!IDS.includes(pillarId as PillarId)) notFound();

  const id = pillarId as PillarId;

  const pillars = getDemoPillarsForRequest();
  const pillar = pillars.find((p) => p.id === id);
  if (!pillar) notFound();

  const findings = getFindings(id);
  const metrics = getMetrics(id);
  const flags = getPillarFlags(id);
  const initialSnap = severitySnapFromFindings(findings);

  const pillarIndex = String(IDS.indexOf(id) + 1).padStart(2, "0");

  return (
    <PillarDemoShell
      pillarId={id}
      initialPillars={pillars}
      initialMetrics={metrics}
      initialSnap={initialSnap}
      findings={findings}
      flags={flags}
      pillarIndexDisplay={pillarIndex}
    />
  );
}
