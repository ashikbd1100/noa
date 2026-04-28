"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ChevronRight,
  ClipboardCheck,
  FileOutput,
  FileUp,
  FlaskConical,
  FolderKanban,
  Gauge,
  GitCompare,
  Layers,
  Play,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PILLARS } from "@/lib/noa-data";
import { cn } from "@/lib/utils";

const DEAL_STAGES = ["Early diligence", "Deep dive", "IC-ready"] as const;

const PILLAR_LABELS = [
  "Applications",
  "Cloud/Infra",
  "Architecture",
  "Security",
  "Personnel",
] as const;

const ARTIFACT_TYPES = [
  { id: "repo", label: "Code repository" },
  { id: "arch", label: "Architecture docs" },
  { id: "cloud", label: "Cloud / IaC configs" },
  { id: "sec", label: "Security reports / scans" },
  { id: "org", label: "Org & process docs" },
] as const;

const PIPELINE_STEPS = [
  "Normalize ingested artifacts & extract technical signals",
  "Classify signals under five pillars (Applications → Personnel)",
  "Generate findings: severity, confidence, evidence links, remediation drafts",
  "Feed scored signals to the score engine & executive / flags draft",
] as const;

type StepId =
  | "create"
  | "ingest"
  | "analyze"
  | "score"
  | "hitl"
  | "decision"
  | "reassess";

type StepDef = {
  id: StepId;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: ReadonlyArray<StepDef> = [
  {
    id: "create",
    label: "Create assessment",
    short: "Create",
    description:
      "Set the target, deal stage, date, and owner for a new diligence engagement.",
    icon: FolderKanban,
  },
  {
    id: "ingest",
    label: "Ingest evidence",
    short: "Ingest",
    description:
      "Connect repo, docs, cloud configs, security reports — optionally mapped to pillars.",
    icon: FileUp,
  },
  {
    id: "analyze",
    label: "Analyze (AI + rules)",
    short: "Analyze",
    description:
      "Pipeline drafts findings with severity, confidence, evidence, and remediation.",
    icon: FlaskConical,
  },
  {
    id: "score",
    label: "Score engine",
    short: "Score",
    description:
      "Tech debt + scalability roll into pillar scores; executive aggregates them.",
    icon: Gauge,
  },
  {
    id: "hitl",
    label: "Human-in-the-loop review",
    short: "Review",
    description:
      "Analyst accepts, edits, or rejects findings; can override severity with rationale.",
    icon: ClipboardCheck,
  },
  {
    id: "decision",
    label: "Decision output",
    short: "Decide",
    description:
      "Headline score, flags, drilldowns, and remediation priorities — exportable.",
    icon: FileOutput,
  },
  {
    id: "reassess",
    label: "Re-assessment",
    short: "Re-run",
    description:
      "Re-run with new evidence; compare deltas vs the prior assessment.",
    icon: GitCompare,
  },
];

const STEPS_BY_ID = STEPS.reduce<Record<StepId, StepDef>>(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<StepId, StepDef>
);

type WorkflowDrawerContextValue = {
  openDrawer: () => void;
};

const WorkflowDrawerContext =
  createContext<WorkflowDrawerContextValue | null>(null);

function useWorkflowDrawer() {
  const ctx = useContext(WorkflowDrawerContext);
  if (!ctx) {
    throw new Error(
      "useWorkflowDrawer must be used within PrototypeWorkflowPanel"
    );
  }
  return ctx;
}

/** Primary CTA for the top nav — opens the diligence workflow drawer. */
export function WorkflowNavCta() {
  const { openDrawer } = useWorkflowDrawer();
  return (
    <Button
      type="button"
      size="sm"
      onClick={openDrawer}
      aria-label="Open diligence workflow"
      className={cn(
        "group noa-mono h-8 gap-1.5 rounded-full border-0 px-3.5 sm:px-4",
        "text-[10px] font-semibold uppercase tracking-[0.14em] text-white",
        "bg-gradient-to-b from-[oklch(0.58_0.24_290)] to-[oklch(0.42_0.22_290)]",
        "shadow-[inset_0_1px_0_oklch(1_0_0/0.18),0_2px_8px_-2px_oklch(0.55_0.22_290/0.55),0_8px_28px_-8px_oklch(0.5_0.2_290/0.65)]",
        "hover:from-[oklch(0.62_0.24_290)] hover:to-[oklch(0.46_0.22_290)] hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.22),0_4px_14px_-3px_oklch(0.55_0.22_290/0.6)]",
        "active:translate-y-px active:brightness-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-[var(--noa-cyan)]/45"
      )}
    >
      <Layers className="size-3.5 opacity-95" aria-hidden />
      <span className="hidden sm:inline">Workflow</span>
      <ChevronRight
        className="size-3.5 opacity-80 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Button>
  );
}

export function PrototypeWorkflowPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"index" | StepId>("index");

  const openDrawer = useCallback(() => setOpen(true), []);

  const ctx = useMemo(
    () => ({
      openDrawer,
    }),
    [openDrawer]
  );

  // Reset to index after the drawer closes (delay so it doesn't flicker mid-transition).
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setView("index"), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const goTo = useCallback((next: "index" | StepId) => setView(next), []);

  const titleNode =
    view === "index" ? (
      <>
        <span className="noa-eyebrow">Workflow</span>
        <span className="noa-display text-base font-semibold leading-tight text-foreground">
          Diligence pipeline
        </span>
      </>
    ) : (
      <>
        <span className="noa-eyebrow">Step {STEPS.findIndex((s) => s.id === view) + 1} of {STEPS.length}</span>
        <span className="noa-display text-base font-semibold leading-tight text-foreground">
          {STEPS_BY_ID[view as StepId].label}
        </span>
      </>
    );

  return (
    <WorkflowDrawerContext.Provider value={ctx}>
      {children}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop
            className={cn(
              "fixed inset-0 z-50 bg-black/45 backdrop-blur-[3px]",
              "data-open:animate-in data-open:fade-in-0",
              "data-closed:animate-out data-closed:fade-out-0",
              "duration-200"
            )}
          />
          <DialogPrimitive.Popup
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[26rem] flex-col",
              "border-l border-white/12 bg-[var(--noa-panel)] text-foreground shadow-2xl outline-none",
              "data-open:animate-in data-closed:animate-out duration-300 ease-out",
              "data-open:slide-in-from-right data-closed:slide-out-to-right"
            )}
          >
            <DrawerHeader
              view={view}
              titleNode={titleNode}
              onBack={() => goTo("index")}
            />
            <div
              key={view}
              className="noa-fade-up flex min-h-0 flex-1 flex-col"
            >
              {view === "index" ? (
                <IndexView onSelect={(id) => goTo(id)} />
              ) : (
                <StepRenderer id={view as StepId} />
              )}
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
      <button
        type="button"
        aria-label="Open diligence workflow"
        onClick={openDrawer}
        className={cn(
          "group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 lg:hidden",
          "rounded-full border border-white/12 bg-black/70 px-3.5 py-2 text-xs",
          "text-foreground shadow-[0_8px_28px_-12px_oklch(0_0_0/0.6),0_0_0_1px_oklch(1_0_0/0.04)]",
          "backdrop-blur-md transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-[var(--noa-violet)]/45 hover:bg-black/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--noa-violet)]/40",
          "sm:bottom-6 sm:right-6"
        )}
      >
        <span className="relative inline-flex size-5 items-center justify-center rounded-full bg-[var(--noa-violet)]/20 ring-1 ring-[var(--noa-violet)]/40">
          <Layers
            className="size-3 text-[var(--noa-violet)] transition-colors group-hover:text-foreground"
            aria-hidden
          />
        </span>
        <span className="noa-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground">
          Workflow
        </span>
      </button>
    </WorkflowDrawerContext.Provider>
  );
}

function DrawerHeader({
  view,
  titleNode,
  onBack,
}: {
  view: "index" | StepId;
  titleNode: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 bg-black/35 px-4 py-3">
      {view !== "index" ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to workflow index"
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-full border border-white/10 bg-black/50",
            "text-muted-foreground transition-all hover:-translate-x-0.5 hover:border-white/20 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--noa-violet)]/40"
          )}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
        </button>
      ) : (
        <span className="relative inline-flex size-7 items-center justify-center rounded-full bg-[var(--noa-violet)]/15 ring-1 ring-[var(--noa-violet)]/35">
          <Layers className="size-3.5 text-[var(--noa-violet)]" aria-hidden />
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        {titleNode}
      </div>
      <DialogPrimitive.Close
        render={
          <button
            type="button"
            aria-label="Close workflow drawer"
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full border border-white/10 bg-black/50",
              "text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--noa-violet)]/40"
            )}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Index view (vertical stepper)
 * ------------------------------------------------------------------ */

function IndexView({ onSelect }: { onSelect: (id: StepId) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Walk through the seven phases — from creating an assessment to
          re-running it with fresh evidence. Each step opens its UI here.
        </p>

        <ol className="space-y-2">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === STEPS.length - 1;
            return (
              <li
                key={step.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="noa-fade-up"
              >
                <div
                  className={cn(
                    "group flex min-h-0 overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.015]",
                    "transition-all duration-200 ease-out",
                    "hover:-translate-y-px hover:border-[var(--noa-violet)]/35 hover:bg-white/[0.04]"
                  )}
                >
                  {/*
                    Dedicated rail column: line is centered on the icon (pl-3 + half size-9)
                    and extends to the next row through space-y-2 (0.5rem).
                  */}
                  <div className="relative flex w-[3.25rem] shrink-0 flex-col items-start py-2.5 pl-3">
                    <span
                      className={cn(
                        "relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full",
                        "border border-white/12 bg-black/65 transition-all duration-200",
                        "group-hover:border-[var(--noa-violet)]/55 group-hover:bg-[var(--noa-violet)]/15"
                      )}
                    >
                      <Icon
                        className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                        aria-hidden
                      />
                      <span className="noa-mono absolute -top-1 -right-1 inline-flex size-4 items-center justify-center rounded-full border border-white/15 bg-black text-[8px] font-semibold tabular-nums text-muted-foreground transition-colors group-hover:border-[var(--noa-violet)]/55 group-hover:text-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    {!isLast ? (
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute z-0 w-px -translate-x-1/2 noa-step-rail-vertical opacity-50",
                          "left-[calc(0.75rem+1.125rem)]",
                          /* Below icon through space-y-2 (0.5rem) + next row pt (0.625rem) */
                          "top-[calc(0.625rem+2.25rem)] -bottom-[1.125rem]"
                        )}
                      />
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelect(step.id)}
                    className={cn(
                      "group flex min-w-0 flex-1 items-start gap-2 py-2.5 pr-3 text-left outline-none",
                      "transition-colors duration-200",
                      "focus-visible:ring-2 focus-visible:ring-[var(--noa-violet)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--noa-panel)]"
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
                      <span className="text-sm font-medium leading-snug text-foreground">
                        {step.label}
                      </span>
                      <span className="text-xs leading-snug text-muted-foreground">
                        {step.description}
                      </span>
                    </span>

                    <ChevronRight
                      className={cn(
                        "mt-1 size-4 shrink-0 text-muted-foreground/60 transition-all duration-200",
                        "group-hover:translate-x-0.5 group-hover:text-foreground"
                      )}
                      aria-hidden
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          Inputs are illustrative — actions echo what production would persist
          (audit, queueing, scoring, exports).
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Step renderer
 * ------------------------------------------------------------------ */

function StepRenderer({ id }: { id: StepId }) {
  switch (id) {
    case "create":
      return <CreateView />;
    case "ingest":
      return <IngestView />;
    case "analyze":
      return <AnalyzeView />;
    case "score":
      return <ScoreView />;
    case "hitl":
      return <HitlView />;
    case "decision":
      return <DecisionView />;
    case "reassess":
      return <ReassessView />;
  }
}

/* Body / footer layout primitives ---------------------------------- */

function ViewBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

function ViewFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-white/10 bg-black/35 px-4 py-3">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 1. Create assessment
 * ------------------------------------------------------------------ */

function CreateView() {
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [targetName, setTargetName] = useState("");
  const [stage, setStage] =
    useState<(typeof DEAL_STAGES)[number]>(DEAL_STAGES[0]);
  const [assessmentDate, setAssessmentDate] = useState("");
  const [owner, setOwner] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <ViewBody>
        <p className="text-xs text-muted-foreground">
          Set the target, deal stage, assessment date, and owner.
        </p>

        <div className="grid gap-3.5">
          <FieldGroup label="Assessment title" htmlFor="proto-title">
            <Input
              id="proto-title"
              value={assessmentTitle}
              onChange={(e) => setAssessmentTitle(e.target.value)}
              placeholder='e.g. "Acme v2 diligence"'
              className="rounded-sm border-white/12 bg-black/50 text-sm"
            />
          </FieldGroup>

          <FieldGroup label="Target legal name" htmlFor="proto-target">
            <Input
              id="proto-target"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g. HelioStack Analytics, Inc."
              className="rounded-sm border-white/12 bg-black/50 text-sm"
            />
          </FieldGroup>

          <FieldGroup label="Deal stage">
            <ChipGroup
              value={stage}
              onChange={(v) =>
                setStage(v as (typeof DEAL_STAGES)[number])
              }
              options={DEAL_STAGES.map((s) => ({ value: s, label: s }))}
            />
          </FieldGroup>

          <div className="grid gap-3 sm:grid-cols-2">
            <FieldGroup label="Assessment date" htmlFor="proto-date">
              <Input
                id="proto-date"
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="rounded-sm border-white/12 bg-black/50 text-sm"
              />
            </FieldGroup>
            <FieldGroup label="Owner" htmlFor="proto-owner">
              <Input
                id="proto-owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Analyst or team"
                className="rounded-sm border-white/12 bg-black/50 text-sm"
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Internal notes" htmlFor="proto-notes">
            <Textarea
              id="proto-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mandate scope, key questions, IC date…"
              rows={3}
              className="resize-none rounded-sm border-white/12 bg-black/50 text-sm"
            />
          </FieldGroup>
        </div>

        {submitted ? (
          <ConfirmationBlock>
            <Sparkles
              className="mt-0.5 size-4 shrink-0 text-[var(--noa-cyan)]"
              aria-hidden
            />
            <p>
              <strong className="font-medium">In production:</strong> this would
              create an assessment record, assign an ID, set permissions, and
              load live data into the views you see in this app.
            </p>
          </ConfirmationBlock>
        ) : null}
      </ViewBody>
      <ViewFooter>
        <Button
          type="button"
          size="sm"
          disabled={submitted}
          onClick={() => setSubmitted(true)}
        >
          {submitted ? "Submitted" : "Create assessment"}
        </Button>
      </ViewFooter>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 2. Ingest evidence
 * ------------------------------------------------------------------ */

function IngestView() {
  const [url, setUrl] = useState("");
  const [highlightDrop, setHighlightDrop] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [queued, setQueued] = useState(false);
  const [artifactSel, setArtifactSel] = useState<Set<string>>(
    () => new Set()
  );
  const [pillarMap, setPillarMap] = useState<Set<string>>(() => new Set());

  const toggle = (set: Set<string>, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  return (
    <>
      <ViewBody>
        <p className="text-xs text-muted-foreground">
          Upload or connect artifacts. Tag the batch to one or more pillars
          (optional); unmapped items stay in a general pool for auto-routing.
        </p>

        <FieldGroup label="Artifact types">
          <div className="flex flex-wrap gap-1.5">
            {ARTIFACT_TYPES.map(({ id, label }) => (
              <Chip
                key={id}
                active={artifactSel.has(id)}
                onClick={() => setArtifactSel((s) => toggle(s, id))}
              >
                {label}
              </Chip>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup label="Map to pillars (optional)">
          <div className="flex flex-wrap gap-1.5">
            {PILLAR_LABELS.map((label) => (
              <Chip
                key={label}
                active={pillarMap.has(label)}
                tone="violet"
                onClick={() => setPillarMap((s) => toggle(s, label))}
              >
                {label}
              </Chip>
            ))}
          </div>
        </FieldGroup>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileRef.current?.click();
            }
          }}
          onDragEnter={() => setHighlightDrop(true)}
          onDragLeave={() => setHighlightDrop(false)}
          onDrop={(e) => {
            e.preventDefault();
            setHighlightDrop(false);
            setQueued(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            "cursor-pointer rounded-md border border-dashed px-4 py-7 text-center transition-colors",
            highlightDrop
              ? "border-[var(--noa-cyan)]/55 bg-[var(--noa-cyan)]/10"
              : "border-white/20 bg-black/30 hover:border-white/30 hover:bg-black/40"
          )}
        >
          <input
            ref={fileRef}
            type="file"
            className="sr-only"
            multiple
            onChange={() => setQueued(true)}
          />
          <FileUp
            className="mx-auto size-7 text-muted-foreground"
            aria-hidden
          />
          <p className="noa-mono mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Drop files or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Selection is staged locally; nothing is uploaded.
          </p>
        </div>

        <FieldGroup label="Repo or doc URL (optional)" htmlFor="proto-url">
          <Input
            id="proto-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/org/repo or drive link"
            className="rounded-sm border-white/12 bg-black/50 text-sm"
          />
        </FieldGroup>

        {queued ? (
          <ConfirmationBlock>
            <Sparkles
              className="mt-0.5 size-4 shrink-0 text-[var(--noa-cyan)]"
              aria-hidden
            />
            <p>
              <strong className="font-medium">In production:</strong> files
              and URLs enter a processing queue with per-artifact status, pillar
              mapping, and parse health.
            </p>
          </ConfirmationBlock>
        ) : null}
      </ViewBody>
      <ViewFooter>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setQueued(true)}
        >
          Queue ingestion
        </Button>
      </ViewFooter>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 3. Analyze
 * ------------------------------------------------------------------ */

function AnalyzeView() {
  const [activeStep, setActiveStep] = useState(0);
  const n = PIPELINE_STEPS.length;
  const [running, setRunning] = useState(true);

  useEffect(() => {
    setActiveStep(0);
    setRunning(true);
    const ids: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= n; i++) {
      ids.push(
        setTimeout(() => {
          setActiveStep(i);
          if (i === n) setRunning(false);
        }, 720 * i)
      );
    }
    return () => ids.forEach(clearTimeout);
  }, [n]);

  const replay = useCallback(() => {
    setActiveStep(0);
    setRunning(true);
    const ids: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= n; i++) {
      ids.push(
        setTimeout(() => {
          setActiveStep(i);
          if (i === n) setRunning(false);
        }, 720 * i)
      );
    }
  }, [n]);

  return (
    <>
      <ViewBody>
        <p className="text-xs text-muted-foreground">
          Extracts signals, classifies under five pillars, and drafts findings
          with severity, confidence, evidence, and remediation.
        </p>

        <div className="rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-xs">
          <p className="noa-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Pillars
          </p>
          <ul className="mt-1.5 grid gap-1 text-muted-foreground sm:grid-cols-2">
            {PILLAR_LABELS.map((label) => (
              <li key={label} className="flex items-center gap-2">
                <span className="size-1 shrink-0 rounded-full bg-[var(--noa-cyan)]" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="noa-eyebrow">Pipeline progress</span>
            <span className="noa-mono text-[10px] tabular-nums text-muted-foreground">
              {Math.min(activeStep, n)} / {n}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--noa-violet)] to-[var(--noa-cyan)] transition-[width] duration-700 ease-out"
              style={{ width: `${(Math.min(activeStep, n) / n) * 100}%` }}
            />
          </div>
        </div>

        <ol className="space-y-2.5">
          {PIPELINE_STEPS.map((label, i) => {
            const finished = activeStep >= n;
            const done = activeStep > i || finished;
            const current = activeStep === i && !finished;
            const pending = activeStep < i && !finished;
            return (
              <li
                key={label}
                style={{ animationDelay: `${i * 80}ms` }}
                className={cn(
                  "noa-fade-up flex gap-3 rounded-md border px-3 py-2 text-xs",
                  "transition-[background-color,border-color,color] duration-300 ease-out",
                  current &&
                    "border-[var(--noa-violet)]/45 bg-[var(--noa-violet)]/10",
                  done && "border-white/10 bg-white/[0.04] text-muted-foreground",
                  pending && "border-white/[0.06] bg-black/20 text-muted-foreground/70"
                )}
              >
                <span
                  className={cn(
                    "noa-mono mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[9px] tabular-nums",
                    "transition-colors duration-300",
                    current
                      ? "border-[var(--noa-violet)]/60 bg-[var(--noa-violet)]/20 text-foreground"
                      : done
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200/90"
                        : "border-white/12 bg-black/40 text-muted-foreground"
                  )}
                >
                  {done && !current ? "✓" : String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium leading-snug",
                      current ? "text-foreground" : "text-foreground/80"
                    )}
                  >
                    {label}
                  </p>
                  {current ? (
                    <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[var(--noa-cyan)]">
                      <span className="relative inline-flex size-1.5">
                        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--noa-cyan)] opacity-70" />
                        <span className="relative inline-block size-1.5 rounded-full bg-[var(--noa-cyan)]" />
                      </span>
                      Running…
                    </p>
                  ) : null}
                  {done ? (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Complete
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Each finding carries severity, model confidence, pointers to evidence,
          and suggested remediation. Analysts validate in step 5; scores roll up
          in step 4.
        </p>
      </ViewBody>
      <ViewFooter>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={replay}
          disabled={running}
        >
          <Play className="size-3.5" aria-hidden />
          Replay simulation
        </Button>
      </ViewFooter>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 4. Score engine
 * ------------------------------------------------------------------ */

function ScoreView() {
  const execAvg =
    PILLARS.reduce((a, p) => a + p.score, 0) / PILLARS.length;

  return (
    <>
      <ViewBody>
        <p className="text-xs text-muted-foreground">
          Per pillar: tech debt and scalability roll into a pillar score;
          executive viability aggregates pillars; R/Y/G flags surface material
          risk.
        </p>

        <div className="rounded-md border border-white/10 bg-black/30 p-3">
          <p className="noa-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Executive roll-up
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {execAvg.toFixed(1)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              composite
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Overall viability is derived from the five pillar scores (weighted
            in production). Flags map to partner-facing red / yellow / green
            narratives.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <FlagPill tone="red">Red — material gaps</FlagPill>
            <FlagPill tone="amber">Yellow — watch items</FlagPill>
            <FlagPill tone="emerald">Green — within band</FlagPill>
          </div>
        </div>

        <ul className="space-y-2.5">
          {PILLARS.map((p, i) => (
            <li
              key={p.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className="noa-fade-up rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-xs"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">{p.label}</span>
                <span className="noa-mono tabular-nums text-muted-foreground">
                  Pillar {p.score}{" "}
                  <span className="text-[10px] text-muted-foreground/80">
                    (debt {p.techDebt} · scale {p.scalability})
                  </span>
                </span>
              </div>
              <div className="mt-2 grid gap-1.5">
                <Bar label="Tech debt" value={p.techDebt} tone="amber" />
                <Bar label="Scalability" value={p.scalability} tone="cyan" />
              </div>
            </li>
          ))}
        </ul>
      </ViewBody>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 5. HITL review
 * ------------------------------------------------------------------ */

function HitlView() {
  const [action, setAction] = useState<"accept" | "edit" | "reject" | null>(
    null
  );
  const [severity, setSeverity] = useState<"red" | "yellow" | "green">(
    "yellow"
  );
  const [rationale, setRationale] = useState("");
  const [recorded, setRecorded] = useState(false);

  return (
    <>
      <ViewBody>
        <p className="text-xs text-muted-foreground">
          Accept, edit, or reject model findings. Override severity if needed
          and record analyst rationale for audit.
        </p>

        <div className="space-y-3 rounded-md border border-white/10 bg-black/30 p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="noa-mono rounded-sm bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Auto finding
            </span>
            <FlagPill tone="amber">Yellow</FlagPill>
            <span className="text-[10px] text-muted-foreground">
              Security · CVE exposure
            </span>
          </div>
          <p className="font-medium text-foreground">
            Elevated transitive dependency risk in billing API surface
          </p>
          <p className="text-muted-foreground">
            Model confidence 78%. Evidence: lockfile diff vs last release, SCA
            export Q3. Suggested remediation: pin major, enable automated PRs
            for patch minors.
          </p>
        </div>

        <FieldGroup label="Decision">
          <ChipGroup
            value={action ?? ""}
            onChange={(v) => setAction(v as typeof action)}
            options={[
              { value: "accept", label: "Accept" },
              { value: "edit", label: "Edit" },
              { value: "reject", label: "Reject" },
            ]}
          />
        </FieldGroup>

        <FieldGroup label="Override severity (optional)">
          <ChipGroup
            value={severity}
            onChange={(v) => setSeverity(v as typeof severity)}
            tone="violet"
            options={[
              { value: "red", label: "Red" },
              { value: "yellow", label: "Yellow" },
              { value: "green", label: "Green" },
            ]}
          />
        </FieldGroup>

        <FieldGroup
          label="Analyst notes & rationale"
          htmlFor="proto-rationale"
        >
          <Textarea
            id="proto-rationale"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Why accept / edit / reject; what changed vs model output…"
            rows={3}
            className="resize-none rounded-sm border-white/12 bg-black/50 text-sm"
          />
        </FieldGroup>

        {recorded ? (
          <ConfirmationBlock>
            <Sparkles
              className="mt-0.5 size-4 shrink-0 text-[var(--noa-cyan)]"
              aria-hidden
            />
            <p>
              <strong className="font-medium">In production:</strong> this would
              write an immutable review event (user, timestamp, prior vs new
              severity, rationale) for audit and IC packs.
            </p>
          </ConfirmationBlock>
        ) : null}
      </ViewBody>
      <ViewFooter>
        <Button
          type="button"
          size="sm"
          disabled={!action || recorded}
          onClick={() => setRecorded(true)}
        >
          {recorded ? "Review recorded" : "Record review"}
        </Button>
      </ViewFooter>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 6. Decision output
 * ------------------------------------------------------------------ */

function DecisionView() {
  return (
    <>
      <ViewBody>
        <p className="text-xs text-muted-foreground">
          Executive summary for partners and principals: headline score, flags,
          pillar drilldowns, remediation priorities — share as link or PDF.
        </p>

        <div className="space-y-3 rounded-md border border-white/10 bg-black/30 p-3 text-xs">
          <p className="noa-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Executive summary
          </p>
          <ul className="list-inside list-disc space-y-1.5 text-muted-foreground">
            <li>
              <strong className="font-medium text-foreground/90">
                Top score:
              </strong>{" "}
              composite reflects solid architecture with concentration of debt
              in delivery and security hygiene.
            </li>
            <li>
              <strong className="font-medium text-foreground/90">Flags:</strong>{" "}
              red on supply-chain exposure; yellow on IaC drift; green on team
              depth vs mandate.
            </li>
            <li>
              <strong className="font-medium text-foreground/90">
                Pillar drilldowns:
              </strong>{" "}
              use Summary and each pillar tab in this app for narrative +
              findings.
            </li>
            <li>
              <strong className="font-medium text-foreground/90">
                Remediation priorities:
              </strong>{" "}
              dependency pinning, secrets rotation program, consolidate IaC
              modules — sequenced by impact × effort.
            </li>
          </ul>
        </div>

        <p className="text-[11px] text-muted-foreground">
          In production, exports respect permissions, watermarking, and version
          the assessment snapshot.
        </p>
      </ViewBody>
      <ViewFooter>
        <Button type="button" size="sm" variant="outline" disabled>
          Copy report link
        </Button>
        <Button type="button" size="sm" disabled>
          Export PDF
        </Button>
      </ViewFooter>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 7. Re-assessment
 * ------------------------------------------------------------------ */

function ReassessView() {
  return (
    <>
      <ViewBody>
        <p className="text-xs text-muted-foreground">
          Re-run with new evidence and compare deltas vs the prior assessment —
          trend of risk and readiness for IC and portfolio monitoring.
        </p>

        <div className="overflow-x-auto rounded-md border border-white/10">
          <table className="w-full min-w-[300px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 noa-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-3 py-2 font-medium">Pillar</th>
                <th className="px-3 py-2 font-medium tabular-nums">Prior</th>
                <th className="px-3 py-2 font-medium tabular-nums">Current</th>
                <th className="px-3 py-2 font-medium tabular-nums">Δ</th>
              </tr>
            </thead>
            <tbody>
              {PILLARS.map((p) => {
                const delta = p.score - p.priorScore;
                const deltaStr = delta > 0 ? `+${delta}` : `${delta}`;
                return (
                  <tr
                    key={p.id}
                    className="border-b border-white/[0.06] last:border-0"
                  >
                    <td className="px-3 py-2 font-medium text-foreground">
                      {p.label}
                    </td>
                    <td className="noa-mono px-3 py-2 tabular-nums text-muted-foreground">
                      {p.priorScore}
                    </td>
                    <td className="noa-mono px-3 py-2 tabular-nums text-foreground">
                      {p.score}
                    </td>
                    <td
                      className={cn(
                        "noa-mono px-3 py-2 tabular-nums",
                        delta > 0 && "text-emerald-400/90",
                        delta < 0 && "text-red-400/90",
                        delta === 0 && "text-muted-foreground"
                      )}
                    >
                      {deltaStr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Queueing a re-run would ingest new artifacts, re-execute analyze +
          score, and preserve history for trend tracking.
        </p>
      </ViewBody>
      <ViewFooter>
        <Button type="button" size="sm" variant="outline" disabled>
          <Play className="size-3.5" aria-hidden />
          Queue re-run
        </Button>
      </ViewFooter>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Shared primitives
 * ------------------------------------------------------------------ */

function FieldGroup({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      {htmlFor ? (
        <Label htmlFor={htmlFor} className="noa-eyebrow text-[10px]">
          {label}
        </Label>
      ) : (
        <span className="noa-eyebrow text-[10px]">{label}</span>
      )}
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  tone = "neutral",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "neutral" | "violet";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "noa-mono rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.14em]",
        "transition-colors duration-200",
        active
          ? tone === "violet"
            ? "bg-[var(--noa-violet)]/20 text-foreground ring-1 ring-[var(--noa-violet)]/35"
            : "bg-white/[0.08] text-foreground ring-1 ring-white/15"
          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
  tone = "neutral",
}: {
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  onChange: (next: string) => void;
  tone?: "neutral" | "violet";
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <Chip
          key={opt.value}
          active={value === opt.value}
          onClick={() => onChange(opt.value)}
          tone={tone}
        >
          {opt.label}
        </Chip>
      ))}
    </div>
  );
}

function ConfirmationBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[var(--noa-cyan)]/30 bg-[var(--noa-cyan)]/10 p-3 text-xs text-foreground/90">
      {children}
    </div>
  );
}

function FlagPill({
  tone,
  children,
}: {
  tone: "red" | "amber" | "emerald";
  children: React.ReactNode;
}) {
  const palette =
    tone === "red"
      ? "border-red-500/35 bg-red-500/15 text-red-100"
      : tone === "amber"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
        : "border-emerald-500/35 bg-emerald-500/15 text-emerald-100";
  return (
    <span
      className={cn(
        "noa-mono rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.12em]",
        palette
      )}
    >
      {children}
    </span>
  );
}

function Bar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "cyan";
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            tone === "amber" ? "bg-amber-500/70" : "bg-[var(--noa-cyan)]/70"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
