export type SeverityTier = "red" | "yellow" | "green";

export type ImpactWeight = "High" | "Medium" | "Low";

export type PillarId =
  | "applications"
  | "cloud-infra"
  | "architecture"
  | "security"
  | "personnel";

export interface PillarMeta {
  id: PillarId;
  label: string;
  shortLabel: string;
  score: number;
  /** Prior assessment composite for this pillar (delta vs `score`). */
  priorScore: number;
  /** 0–100 higher = more debt */
  techDebt: number;
  /** 0–100 higher = more scalability */
  scalability: number;
  impactWeight: ImpactWeight;
  summaryLine: string;
  heroDescriptor: string;
  colorBand: SeverityTier;
}

export interface FlagItem {
  id: string;
  tier: SeverityTier;
  text: string;
}

export interface Finding {
  id: string;
  severity: SeverityTier;
  title: string;
  category: string;
  /** 0–100 for inline bar fill */
  severityScore: number;
  source: "auto" | "analyst";
  detail: string;
  remediation: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  series: number[];
}

/** Demo pillar overview — findings severity snapshot (may diverge from feed after reroll). */
export interface SeveritySnap {
  red: number;
  yellow: number;
  green: number;
  analyst: number;
  total: number;
}
