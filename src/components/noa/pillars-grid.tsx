"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { DebtScalabilityTension } from "@/components/noa/debt-scalability-tension";
import {
  useAccentSentinel,
  useAnimatedNumber,
} from "@/components/noa/noa-demo-motion";
import { BandBadge } from "@/components/noa/band-badge";
import { InlineCopyLine } from "@/components/noa/inline-copy-line";
import { Panel } from "@/components/noa/panel";
import { randomizeDemoPillars } from "@/lib/noa-demo-random";
import type { PillarMeta } from "@/lib/noa-types";
import { cn } from "@/lib/utils";

const bandAccent: Record<string, string> = {
  red: "var(--noa-severity-red)",
  yellow: "var(--noa-severity-yellow)",
  green: "var(--noa-severity-green)",
};

export function PillarsGrid({ initialPillars }: { initialPillars: PillarMeta[] }) {
  const [pillars, setPillars] = useState(initialPillars);

  const onCycle = useCallback(() => {
    setPillars(randomizeDemoPillars());
  }, []);

  const sentinelRef = useAccentSentinel(onCycle);

  return (
    <div className="relative">
      <span
        ref={sentinelRef}
        className="noa-accent-demo-sentinel pointer-events-none absolute left-0 top-0 z-[1] size-px opacity-0"
        aria-hidden
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pillars.map((p, i) => (
          <PillarCard key={p.id} pillar={p} index={i} accent={bandAccent[p.colorBand] ?? "var(--noa-cyan)"} />
        ))}
      </div>
    </div>
  );
}

function PillarCard({
  pillar: p,
  index: i,
  accent,
}: {
  pillar: PillarMeta;
  index: number;
  accent: string;
}) {
  const animScore = useAnimatedNumber(p.score);
  const animDebt = useAnimatedNumber(p.techDebt);
  const animScale = useAnimatedNumber(p.scalability);

  return (
    <Link
      href={`/pillar/${p.id}`}
      className="group block focus-visible:outline-none"
    >
      <Panel
        tone="panel"
        brackets
        className="relative h-full overflow-hidden p-5 transition-colors hover:bg-[oklch(0.085_0.014_270)]"
      >
        <div
          className="absolute left-0 top-0 h-px w-full"
          style={{
            background: `linear-gradient(90deg, ${accent} 0%, transparent 60%)`,
            opacity: 0.6,
          }}
          aria-hidden
        />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <InlineCopyLine>
              <p className="noa-eyebrow flex items-center gap-2">
                <span className="text-foreground/70">
                  P{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-white/20">/</span>
                <span>{p.label}</span>
              </p>
            </InlineCopyLine>
            <InlineCopyLine>
              <h3 className="noa-display text-lg font-semibold tracking-tight text-foreground">
                {p.label}
              </h3>
            </InlineCopyLine>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>

        <InlineCopyLine>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {p.summaryLine}
          </p>
        </InlineCopyLine>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="space-y-2">
            <InlineCopyLine>
              <p className="noa-eyebrow">Score</p>
            </InlineCopyLine>
            <InlineCopyLine>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="noa-display noa-tnum text-4xl font-semibold leading-none text-foreground">
                  {animScore}
                </span>
                <span className="noa-mono text-[10px] font-medium text-muted-foreground">
                  /100
                </span>
              </div>
            </InlineCopyLine>
          </div>
          <BandBadge band={p.colorBand} size="xs" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
          <InlineCopyLine>
            <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Influence
            </span>
          </InlineCopyLine>
          <InlineCopyLine>
            <span
              className={cn(
                "noa-mono text-[10px] uppercase tracking-[0.18em]",
                p.impactWeight === "High"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {p.impactWeight}
            </span>
          </InlineCopyLine>
        </div>

        <div className="mt-4">
          <DebtScalabilityTension
            techDebt={animDebt}
            scalability={animScale}
            dense
          />
        </div>
      </Panel>
    </Link>
  );
}
