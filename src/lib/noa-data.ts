import { cache } from "react";
import type {
  Finding,
  FlagItem,
  MetricCard,
  PillarId,
  PillarMeta,
} from "./noa-types";
import {
  severityBandFromScore,
} from "./noa-utils";
import { pillarSeedRows, randomizeDemoPillars } from "./noa-demo-random";
import {
  buildExecutiveSummary,
  EXEC_SUMMARY_NARRATIVE,
} from "./noa-executive-summary";

export { EXEC_SUMMARY_NARRATIVE };

export const TARGET_COMPANY = "HelioStack Analytics, Inc.";

export const PILLARS: PillarMeta[] = pillarSeedRows.map((p) => ({
  ...p,
  colorBand: severityBandFromScore(p.score),
}));

/** One randomized pillar snapshot per React server request (shared by pages that import it). */
export const getDemoPillarsForRequest = cache(randomizeDemoPillars);

export function getExecutiveSummary(pillars: PillarMeta[] = PILLARS) {
  return buildExecutiveSummary(pillars);
}

export function getPillar(id: PillarId): PillarMeta | undefined {
  return PILLARS.find((p) => p.id === id);
}

const flagsExecutive: FlagItem[] = [
  {
    id: "ef1",
    tier: "red",
    text: "Critical-path service depends on unmaintained auth adapter with known CVE backlog.",
  },
  {
    id: "ef2",
    tier: "red",
    text: "Production secrets rotation policy is documented but not enforced in two regions.",
  },
  {
    id: "ef3",
    tier: "red",
    text: "Revenue ledger reconciliation job lacks idempotency guarantees under load.",
  },
  {
    id: "ef4",
    tier: "yellow",
    text: "Test coverage is uneven — payment rail modules trail platform average by 18 pts.",
  },
  {
    id: "ef5",
    tier: "yellow",
    text: "Observability cardinality limits are being approached in peak trading windows.",
  },
  {
    id: "ef6",
    tier: "yellow",
    text: "Data residency mapping for EU tenants is complete; APAC subprocessor list lags.",
  },
  {
    id: "ef7",
    tier: "green",
    text: "Executive engineering bench and incident response playbooks exceed sector norms.",
  },
  {
    id: "ef8",
    tier: "green",
    text: "Architecture review guild is active with recorded ADRs for major boundaries.",
  },
];

const flagsByPillar: Record<PillarId, FlagItem[]> = {
  applications: [
    {
      id: "a1",
      tier: "red",
      text: "Monolithic deployment unit still owns 34% of weekly change risk.",
    },
    {
      id: "a2",
      tier: "yellow",
      text: "API versioning strategy is consistent but consumer migration is 62% complete.",
    },
    {
      id: "a3",
      tier: "green",
      text: "Static analysis gates block merges on critical severity in default branch.",
    },
  ],
  "cloud-infra": [
    {
      id: "c1",
      tier: "red",
      text: "Terraform state fragmentation across three backends complicates blast-radius analysis.",
    },
    {
      id: "c2",
      tier: "yellow",
      text: "Autoscaling policies are tuned for steady state, not burst marketing events.",
    },
    {
      id: "c3",
      tier: "green",
      text: "Multi-AZ posture and backup RPO targets meet stated SLAs in audit samples.",
    },
  ],
  architecture: [
    {
      id: "ar1",
      tier: "yellow",
      text: "Synchronous inventory calls create a latent coupling with fulfillment domain.",
    },
    {
      id: "ar2",
      tier: "green",
      text: "Domain boundaries align with revenue lines — supports carve-out scenarios.",
    },
  ],
  security: [
    {
      id: "s1",
      tier: "red",
      text: "Dependency graph shows 11 high-severity findings awaiting patch windows.",
    },
    {
      id: "s2",
      tier: "yellow",
      text: "SBOM generation is automated for services but not for internal libraries.",
    },
    {
      id: "s3",
      tier: "green",
      text: "SSO + SCIM rollout for enterprise tenants is complete with clean audit trail.",
    },
  ],
  personnel: [
    {
      id: "p1",
      tier: "yellow",
      text: "SRE staffing ratio is below target for on-call sustainability at current scale.",
    },
    {
      id: "p2",
      tier: "green",
      text: "Engineering attrition trailing 12mo is inside top-quartile for peer cohort.",
    },
  ],
};

export function getExecutiveFlags(): FlagItem[] {
  return flagsExecutive;
}

export function getPillarFlags(pillarId: PillarId): FlagItem[] {
  return flagsByPillar[pillarId];
}

const findingsByPillar: Record<PillarId, Finding[]> = {
  applications: [
    {
      id: "af1",
      severity: "red",
      title: "Stale dependency chain in billing orchestration service",
      category: "Dependency vulnerability",
      severityScore: 92,
      source: "auto",
      detail:
        "Transitive packages include versions with public exploits; upgrade path crosses major semver.",
      remediation:
        "Pin upgraded minors, run contract tests against PSP sandboxes, staged rollout with feature flag.",
    },
    {
      id: "af2",
      severity: "red",
      title: "Shared database session anti-pattern in checkout hot path",
      category: "Architectural pattern",
      severityScore: 88,
      source: "analyst",
      detail:
        "Long-lived sessions observed under peak — correlates with p99 latency spikes in review window.",
      remediation:
        "Introduce command/query split for read models; cap pool sizes; add contention metrics.",
    },
    {
      id: "af3",
      severity: "yellow",
      title: "Integration test suite runtime blocks nightly deploy cadence",
      category: "Maintainability",
      severityScore: 58,
      source: "auto",
      detail:
        "Suite exceeds 90 minutes; parallelization is partial; flaky tests concentrated in legacy module.",
      remediation:
        "Quarantine flaky tests, shard by domain, promote smoke tier as deploy gate.",
    },
    {
      id: "af4",
      severity: "yellow",
      title: "API documentation drift vs. implemented contracts",
      category: "Missing documentation",
      severityScore: 44,
      source: "analyst",
      detail:
        "OpenAPI artifacts lag behind production for two external partner surfaces.",
      remediation:
        "Generate schema from code, enforce publish on merge, add contract diff in CI.",
    },
    {
      id: "af5",
      severity: "green",
      title: "Feature flag governance aligns with release train",
      category: "Process validation",
      severityScore: 22,
      source: "auto",
      detail:
        "Flag lifecycle policies and ownership metadata present in configuration store.",
      remediation: "Maintain quarterly audit of stale flags — no immediate action.",
    },
  ],
  "cloud-infra": [
    {
      id: "cf1",
      severity: "red",
      title: "IAM role assumption paths allow cross-environment privilege bleed",
      category: "Security control gap",
      severityScore: 90,
      source: "auto",
      detail:
        "Policy simulation shows unintended trust chain between staging and prod roles.",
      remediation:
        "Split trust anchors, enforce SCP boundaries, add automated policy regression tests.",
    },
    {
      id: "cf2",
      severity: "yellow",
      title: "Cost anomaly detection not wired to paging for non-prod accounts",
      category: "Operational gap",
      severityScore: 51,
      source: "analyst",
      detail:
        "Anomalies are visible in dashboard but alerts only reach FinOps email list.",
      remediation: "Route P2+ anomalies to on-call with runbook link.",
    },
    {
      id: "cf3",
      severity: "green",
      title: "Backup restore drills executed quarterly with documented RTO evidence",
      category: "Process validation",
      severityScore: 18,
      source: "auto",
      detail: "Sampled drills show RPO/RTO within stated targets for core datastores.",
      remediation: "Continue current cadence; extend to DR region failover annually.",
    },
  ],
  architecture: [
    {
      id: "arf1",
      severity: "yellow",
      title: "Synchronous call fan-out from catalog to pricing domain",
      category: "Architectural pattern",
      severityScore: 55,
      source: "auto",
      detail:
        "Call graph depth increases failure blast radius during pricing engine incidents.",
      remediation:
        "Move to event-sourced price snapshots with cache-aside for hot reads.",
    },
    {
      id: "arf2",
      severity: "green",
      title: "Clear bounded contexts mapped to team ownership",
      category: "Documentation",
      severityScore: 20,
      source: "analyst",
      detail:
        "Context map is maintained in repo; ownership matches CI CODEOWNERS.",
      remediation: "None — use as template for new domains.",
    },
  ],
  security: [
    {
      id: "sf1",
      severity: "red",
      title: "Container image base layers exceed patch SLA in worker fleet",
      category: "Dependency vulnerability",
      severityScore: 94,
      source: "auto",
      detail:
        "CVE count in worker images above policy threshold; rebuild pipeline intermittent.",
      remediation:
        "Harden base image, enforce digest pinning, add weekly rebuild cron with failure paging.",
    },
    {
      id: "sf2",
      severity: "yellow",
      title: "Secrets scanner excludes legacy monorepo subtree",
      category: "Control gap",
      severityScore: 48,
      source: "analyst",
      detail:
        "Exclusion predates acquisition; subtree still receives commits weekly.",
      remediation: "Re-enable scanner with allowlist workflow for documented exceptions only.",
    },
  ],
  personnel: [
    {
      id: "pf1",
      severity: "yellow",
      title: "On-call rotation density elevated for platform team",
      category: "Capacity signal",
      severityScore: 46,
      source: "auto",
      detail:
        "Pager load per engineer exceeds internal SRE guideline by 22% trailing 90 days.",
      remediation:
        "Hire 1 SRE FTE, reduce low-value pages via SLO tuning, shift runbooks to self-serve.",
    },
    {
      id: "pf2",
      severity: "green",
      title: "Engineering ladder and calibration artifacts are current",
      category: "Process validation",
      severityScore: 15,
      source: "analyst",
      detail:
        "Talent reviews show consistent leveling; IC leadership track is staffed.",
      remediation: "Monitor span of control as org grows past 180 engineers.",
    },
  ],
};

const tierOrder = { red: 0, yellow: 1, green: 2 } as const;

export function getFindings(pillarId: PillarId): Finding[] {
  return [...findingsByPillar[pillarId]].sort((a, b) => {
    const t = tierOrder[a.severity] - tierOrder[b.severity];
    if (t !== 0) return t;
    return b.severityScore - a.severityScore;
  });
}

const metricsByPillar: Record<PillarId, MetricCard[]> = {
  applications: [
    {
      id: "am1",
      label: "Total findings",
      value: "128",
      series: [40, 44, 48, 52, 58, 62, 68, 72],
    },
    {
      id: "am2",
      label: "Critical dependency paths",
      value: "7",
      series: [12, 11, 10, 9, 9, 8, 8, 7],
    },
    {
      id: "am3",
      label: "Maintainability index",
      value: "62",
      series: [58, 59, 60, 60, 61, 61, 62, 62],
    },
    {
      id: "am4",
      label: "Test coverage (weighted)",
      value: "71%",
      series: [62, 64, 65, 66, 67, 68, 70, 71],
    },
    {
      id: "am5",
      label: "Deprecated API consumers",
      value: "23",
      series: [41, 38, 35, 32, 30, 28, 26, 23],
    },
    {
      id: "am6",
      label: "Deploys / week (p50)",
      value: "18",
      series: [9, 10, 11, 12, 14, 15, 16, 18],
    },
  ],
  "cloud-infra": [
    {
      id: "cm1",
      label: "IaC drift instances",
      value: "19",
      series: [28, 26, 24, 23, 22, 21, 20, 19],
    },
    {
      id: "cm2",
      label: "Region coverage",
      value: "4",
      series: [3, 3, 3, 4, 4, 4, 4, 4],
    },
    {
      id: "cm3",
      label: "Mean deploy lead time",
      value: "38m",
      series: [55, 52, 48, 45, 42, 40, 39, 38],
    },
    {
      id: "cm4",
      label: "Cost per txn (indexed)",
      value: "0.94",
      series: [1.12, 1.08, 1.04, 1.01, 0.99, 0.97, 0.95, 0.94],
    },
  ],
  architecture: [
    {
      id: "arm1",
      label: "Coupling hotspots",
      value: "5",
      series: [9, 8, 8, 7, 6, 6, 5, 5],
    },
    {
      id: "arm2",
      label: "ADR coverage",
      value: "88%",
      series: [62, 68, 72, 76, 80, 83, 86, 88],
    },
    {
      id: "arm3",
      label: "Cyclomatic risk (max)",
      value: "24",
      series: [34, 32, 30, 28, 27, 26, 25, 24],
    },
    {
      id: "arm4",
      label: "Async boundary %",
      value: "61%",
      series: [44, 48, 51, 54, 56, 58, 60, 61],
    },
  ],
  security: [
    {
      id: "sm1",
      label: "Open findings",
      value: "43",
      series: [62, 58, 55, 52, 49, 46, 44, 43],
    },
    {
      id: "sm2",
      label: "Mean time to remediate",
      value: "11d",
      series: [22, 20, 18, 16, 15, 14, 12, 11],
    },
    {
      id: "sm3",
      label: "SBOM completeness",
      value: "76%",
      series: [48, 52, 58, 62, 66, 70, 74, 76],
    },
    {
      id: "sm4",
      label: "Policy-as-code coverage",
      value: "69%",
      series: [38, 44, 50, 55, 58, 62, 66, 69],
    },
  ],
  personnel: [
    {
      id: "pm1",
      label: "Eng headcount",
      value: "164",
      series: [118, 126, 134, 140, 146, 152, 158, 164],
    },
    {
      id: "pm2",
      label: "Voluntary attrition (12mo)",
      value: "7.1%",
      series: [11, 10.2, 9.4, 8.8, 8.2, 7.8, 7.4, 7.1],
    },
    {
      id: "pm3",
      label: "Time in role (median EM)",
      value: "2.4y",
      series: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.35, 2.4],
    },
    {
      id: "pm4",
      label: "On-call incidents / mo",
      value: "14",
      series: [22, 21, 20, 18, 17, 16, 15, 14],
    },
  ],
};

export function getMetrics(pillarId: PillarId): MetricCard[] {
  return metricsByPillar[pillarId];
}
