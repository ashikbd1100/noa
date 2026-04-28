import type { PillarMeta, SeverityTier } from "./noa-types";

export function severityBandFromScore(score: number): SeverityTier {
  if (score < 42) return "red";
  if (score < 72) return "yellow";
  return "green";
}

export function severityLabel(tier: SeverityTier): string {
  switch (tier) {
    case "red":
      return "Red";
    case "yellow":
      return "Yellow";
    case "green":
      return "Green";
  }
}

export function overallScore(pillars: PillarMeta[]): number {
  if (pillars.length === 0) return 0;
  return Math.round(
    pillars.reduce((a, p) => a + p.score, 0) / pillars.length
  );
}

/** Brief: macro-level secondary insight — roll up pillar tech-debt / scalability signals. */
export function macroTechDebt(pillars: PillarMeta[]): number {
  if (pillars.length === 0) return 0;
  return Math.round(
    pillars.reduce((a, p) => a + p.techDebt, 0) / pillars.length
  );
}

export function macroScalability(pillars: PillarMeta[]): number {
  if (pillars.length === 0) return 0;
  return Math.round(
    pillars.reduce((a, p) => a + p.scalability, 0) / pillars.length
  );
}
