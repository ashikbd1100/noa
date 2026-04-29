import type { MetricCard, PillarMeta } from "./noa-types";
import { severityBandFromScore } from "./noa-utils";

/** Canonical pillar rows (labels & copy); numeric fields match `/pillar/*` static case files when not randomized. */
export const pillarSeedRows: Omit<PillarMeta, "colorBand">[] = [
  {
    id: "applications",
    label: "Applications",
    shortLabel: "Apps",
    score: 68,
    priorScore: 64,
    techDebt: 52,
    scalability: 48,
    impactWeight: "High",
    summaryLine:
      "Legacy service mesh patterns limiting release velocity across core APIs.",
    heroDescriptor:
      "Elevated debt concentration across core services with uneven test discipline.",
  },
  {
    id: "cloud-infra",
    label: "Cloud / Infra",
    shortLabel: "Cloud",
    score: 61,
    priorScore: 57,
    techDebt: 58,
    scalability: 42,
    impactWeight: "High",
    summaryLine:
      "Multi-region footprint is strong; IaC drift and key management need consolidation.",
    heroDescriptor:
      "Operational maturity is mid-flight — scaling headroom exists but policy gaps remain.",
  },
  {
    id: "architecture",
    label: "Architecture",
    shortLabel: "Arch",
    score: 74,
    priorScore: 70,
    techDebt: 41,
    scalability: 59,
    impactWeight: "Medium",
    summaryLine:
      "Service boundaries are coherent; a few synchronous choke points warrant refactor.",
    heroDescriptor:
      "Foundational modularity is above peer median with isolated coupling hotspots.",
  },
  {
    id: "security",
    label: "Security",
    shortLabel: "Sec",
    score: 55,
    priorScore: 51,
    techDebt: 63,
    scalability: 37,
    impactWeight: "High",
    summaryLine:
      "Secrets hygiene and dependency CVE exposure are the dominant diligence themes.",
    heroDescriptor:
      "Material exposure in third-party supply chain; controls trajectory is improving.",
  },
  {
    id: "personnel",
    label: "Personnel",
    shortLabel: "People",
    score: 79,
    priorScore: 75,
    techDebt: 34,
    scalability: 66,
    impactWeight: "Low",
    summaryLine:
      "Engineering leadership depth is a strength; bench depth in SRE is thinner.",
    heroDescriptor:
      "Team topology supports scale; retention signals stable vs. market comps.",
  },
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomPartition3(total: number): [number, number, number] {
  if (total <= 0) return [0, 0, 0];
  const a = randInt(0, total);
  const b = randInt(0, total - a);
  const c = total - a - b;
  return [a, b, c];
}

/** Demo-only: randomized severity buckets that still sum to total findings count. */
export function randomSeverityRoll(totalFindings: number) {
  if (totalFindings <= 0) {
    return { red: 0, yellow: 0, green: 0, analyst: 0, total: 0 };
  }
  const [red, yellow, green] = randomPartition3(totalFindings);
  const analyst = randInt(0, totalFindings);
  return { red, yellow, green, analyst, total: totalFindings };
}

/** Parse headline number from metric card display string (for tween targets). */
export function parseMetricDisplay(value: string): number {
  const num = parseFloat(value.trim().replace(/[^\d.-]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

/** Format a numeric sample like the template string (matches existing metric labels). */
export function formatMetricDisplay(template: string, n: number): string {
  const t = template.trim();
  if (t.endsWith("%")) {
    const oneDecimal = /^\d+\.\d+%$/.test(t);
    return oneDecimal ? `${n.toFixed(1)}%` : `${Math.round(n)}%`;
  }
  if (t.endsWith("m") && !/^\d+d$/i.test(t)) {
    return `${Math.round(n)}m`;
  }
  if (t.endsWith("d")) {
    return `${Math.round(n)}d`;
  }
  if (t.endsWith("y")) {
    return `${n.toFixed(1)}y`;
  }
  if (/^0\.\d+$/.test(t) || (/^\d+\.\d+$/.test(t) && n < 50 && !t.endsWith("%"))) {
    return n.toFixed(2);
  }
  return String(Math.round(n));
}

/** Demo tick: perturb spark series + headline while preserving ids and labels. */
export function randomizeMetricCards(cards: MetricCard[]): MetricCard[] {
  return cards.map((m) => {
    const lastKnown = m.series[m.series.length - 1];
    const anchor =
      typeof lastKnown === "number" && Number.isFinite(lastKnown)
        ? lastKnown
        : parseMetricDisplay(m.value);
    const jitter = randFloat(0.78, 1.22);
    const target = Math.max(
      0.01,
      anchor * jitter + randFloat(-anchor * 0.06, anchor * 0.06)
    );
    const baseStart =
      typeof m.series[0] === "number" && Number.isFinite(m.series[0])
        ? m.series[0]
        : target * randFloat(0.85, 1.05);
    const series = m.series.map((_, i) => {
      const tau = i / Math.max(1, m.series.length - 1);
      const v =
        baseStart +
        (target - baseStart) * tau +
        randFloat(-target * 0.025, target * 0.025);
      return Number(Number(v.toPrecision(5)));
    });
    series[series.length - 1] = Number(target.toPrecision(5));
    const roundedLast = series[series.length - 1];
    return {
      ...m,
      series,
      value: formatMetricDisplay(m.value, roundedLast),
    };
  });
}

/** Demo-only: randomized pillar scores — SSR (`getDemoPillarsForRequest`) and client ticks share this. */
export function randomizeDemoPillars(): PillarMeta[] {
  return pillarSeedRows.map((p) => {
    const score = randInt(44, 93);
    const priorScore = Math.min(94, Math.max(38, score - randInt(2, 14)));
    const techDebt = randInt(24, 86);
    const scalability = randInt(24, 86);
    return {
      ...p,
      score,
      priorScore,
      techDebt,
      scalability,
      colorBand: severityBandFromScore(score),
    };
  });
}
