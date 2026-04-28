import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "panel" | "panel-2" | "glass" | "glass-strong";

const toneClass: Record<Tone, string> = {
  panel: "noa-panel",
  "panel-2": "noa-panel-2",
  glass: "noa-glass",
  "glass-strong": "noa-glass-strong",
};

export function Panel({
  as: As = "div",
  tone = "panel",
  brackets = false,
  inner = true,
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  tone?: Tone;
  brackets?: boolean;
  inner?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <As
      className={cn(
        "relative rounded-md",
        toneClass[tone],
        inner && "noa-inner-highlight",
        brackets && "noa-brackets-4",
        className
      )}
      {...props}
    >
      {brackets ? (
        <>
          <span className="noa-bracket noa-bracket-tl" />
          <span className="noa-bracket noa-bracket-tr" />
          <span className="noa-bracket noa-bracket-bl" />
          <span className="noa-bracket noa-bracket-br" />
        </>
      ) : null}
      {children}
    </As>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  description,
  trailing,
  className,
}: {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? <p className="noa-eyebrow">{eyebrow}</p> : null}
        {title ? (
          <h2 className="noa-display text-[15px] font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </header>
  );
}
