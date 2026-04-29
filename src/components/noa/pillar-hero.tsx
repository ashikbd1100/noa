import { ViabilityGauge } from "@/components/noa/viability-gauge";
import { DebtScalabilityTension } from "@/components/noa/debt-scalability-tension";
import { BandBadge } from "@/components/noa/band-badge";
import { ScoreDelta } from "@/components/noa/score-delta";
import { PillarVolumetricMark } from "@/components/noa/pillar-volumetric-mark";
import { RibbonBackdrop } from "@/components/noa/ribbon-backdrop";
import { InlineCopyLine } from "@/components/noa/inline-copy-line";
import type { PillarMeta } from "@/lib/noa-types";

export function PillarHeroBlock({ pillar }: { pillar: PillarMeta }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 noa-glass-strong noa-ambient-glow">
      <RibbonBackdrop />
      <div
        className="pointer-events-none absolute inset-0 noa-mesh opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-[oklch(0.62_0.22_290/0.18)] blur-3xl noa-motion-ambient"
        aria-hidden
      />

      <div className="relative grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <PillarVolumetricMark pillarId={pillar.id} size={56} />
              <div className="min-w-0 flex-1 space-y-2">
                <InlineCopyLine>
                  <p className="noa-eyebrow">Pillar</p>
                </InlineCopyLine>
                <InlineCopyLine>
                  <h2 className="noa-display text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
                    {pillar.label}
                  </h2>
                </InlineCopyLine>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <InlineCopyLine>
                <div className="flex justify-end">
                  <BandBadge band={pillar.colorBand} />
                </div>
              </InlineCopyLine>
              <InlineCopyLine>
                <ScoreDelta current={pillar.score} prior={pillar.priorScore} />
              </InlineCopyLine>
            </div>
          </div>

          <InlineCopyLine>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {pillar.heroDescriptor}
            </p>
          </InlineCopyLine>

          <div className="grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4">
            <Stat label="Influence" value={pillar.impactWeight} />
            <Stat label="Tech debt" value={String(pillar.techDebt)} />
            <Stat label="Scalability" value={String(pillar.scalability)} />
          </div>
        </div>

        <span className="hidden h-full w-px bg-white/[0.06] lg:block" aria-hidden />

        <div className="flex flex-col items-center gap-6">
          <ViabilityGauge
            score={pillar.score}
            size="md"
            label="Pillar score"
            caption={pillar.summaryLine}
          />
          <DebtScalabilityTension
            techDebt={pillar.techDebt}
            scalability={pillar.scalability}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <InlineCopyLine>
        <span className="noa-eyebrow">{label}</span>
      </InlineCopyLine>
      <InlineCopyLine>
        <span className="noa-display noa-tnum text-base font-semibold text-foreground">
          {value}
        </span>
      </InlineCopyLine>
    </div>
  );
}
