import { InlineCopyLine } from "@/components/noa/inline-copy-line";
import { FlagsPanel } from "@/components/noa/flags-panel";
import { NoaTabs } from "@/components/noa/noa-tabs";
import { OverviewPanel } from "@/components/noa/overview-panel";
import { PillarsGrid } from "@/components/noa/pillars-grid";
import {
  getDemoPillarsForRequest,
  getExecutiveFlags,
  TARGET_COMPANY,
} from "@/lib/noa-data";

export const dynamic = "force-dynamic";

export default function ExecutiveSummaryPage() {
  const pillars = getDemoPillarsForRequest();
  const flags = getExecutiveFlags();
  const counts = {
    red: flags.filter((f) => f.tier === "red").length,
    yellow: flags.filter((f) => f.tier === "yellow").length,
    green: flags.filter((f) => f.tier === "green").length,
  };

  return (
    <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      {/* TOP META BAR */}
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <InlineCopyLine>
            <p className="noa-eyebrow flex items-center gap-2">
              <span className="size-1 rounded-full bg-[var(--noa-cyan)] noa-motion-pulse" />
              <span>Executive summary &amp; scorecard</span>
            </p>
          </InlineCopyLine>
          <InlineCopyLine>
            <h1 className="noa-display mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Verdict before{" "}
              <span className="text-muted-foreground">the case file.</span>
            </h1>
          </InlineCopyLine>
          <InlineCopyLine>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Composite viability, pillar roll-ups, inverse tech-debt vs.
              scalability tension, and a memo-style flags ledger.
            </p>
          </InlineCopyLine>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <InlineCopyLine>
            <p className="noa-eyebrow">Target</p>
          </InlineCopyLine>
          <InlineCopyLine>
            <p className="noa-display text-base font-semibold text-foreground">
              {TARGET_COMPANY}
            </p>
          </InlineCopyLine>
          <InlineCopyLine>
            <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Assessment · 2026 Q2
            </span>
          </InlineCopyLine>
        </div>
      </div>

      <NoaTabs
        defaultValue="overview"
        tabs={[
          {
            id: "overview",
            label: "Overview",
            index: "01",
            content: (
              <OverviewPanel
                initialPillars={pillars}
                counts={counts}
                flags={flags}
              />
            ),
          },
          {
            id: "pillars",
            label: "Pillars",
            index: "02",
            trailing: (
              <span className="noa-mono rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                {pillars.length}
              </span>
            ),
            content: <PillarsGrid initialPillars={pillars} />,
          },
          {
            id: "flags",
            label: "Flags",
            index: "03",
            trailing: (
              <span className="noa-mono rounded-sm border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                {flags.length}
              </span>
            ),
            content: (
              <FlagsPanel flags={flags} index="03" />
            ),
          },
        ]}
      />
    </main>
  );
}
