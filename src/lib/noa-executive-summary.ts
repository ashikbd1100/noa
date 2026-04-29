import type { PillarMeta } from "./noa-types";
import {
  macroScalability,
  macroTechDebt,
  overallScore,
} from "./noa-utils";

export const EXEC_SUMMARY_NARRATIVE = {
  contextLine:
    "Strong architectural foundation with moderate debt exposure concentrated in delivery paths.",
} as const;

export type ExecutiveSummaryView = {
  contextLine: string;
  overallScore: number;
  priorScore: number;
  macroTechDebt: number;
  macroScalability: number;
};

export function buildExecutiveSummary(
  pillars: PillarMeta[]
): ExecutiveSummaryView {
  const priorComposite = Math.round(
    pillars.reduce((a, p) => a + p.priorScore, 0) / pillars.length
  );
  return {
    ...EXEC_SUMMARY_NARRATIVE,
    overallScore: overallScore(pillars),
    priorScore: priorComposite,
    macroTechDebt: macroTechDebt(pillars),
    macroScalability: macroScalability(pillars),
  };
}
