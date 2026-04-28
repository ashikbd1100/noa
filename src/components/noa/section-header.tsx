import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  trailing,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="noa-eyebrow flex items-center gap-2">
            {index ? <span className="text-foreground/70">{index}</span> : null}
            {index && eyebrow ? (
              <span className="text-white/20">/</span>
            ) : null}
            {eyebrow ? <span>{eyebrow}</span> : null}
          </p>
          <h2 className="noa-display mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {trailing}
      </div>
      <div className="noa-hr" />
    </div>
  );
}
