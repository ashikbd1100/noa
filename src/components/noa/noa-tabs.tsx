"use client";

import type { ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type NoaTabDef = {
  id: string;
  label: string;
  /** Optional small mono prefix, e.g. "01" */
  index?: string;
  /** Optional badge / count rendered after the label */
  trailing?: ReactNode;
  content: ReactNode;
};

export function NoaTabs({
  tabs,
  defaultValue,
  className,
  toolbar,
}: {
  tabs: NoaTabDef[];
  defaultValue?: string;
  className?: string;
  /** Optional right-aligned content beside the tab list (filters, status, etc.) */
  toolbar?: ReactNode;
}) {
  if (tabs.length === 0) return null;
  const initial = defaultValue ?? tabs[0].id;

  return (
    <Tabs defaultValue={initial} className={cn("w-full", className)}>
      <div className="mb-6 flex flex-col gap-3 border-b border-white/[0.07] pb-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList variant="nav" className="-ml-1 overflow-x-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="gap-1.5">
              {t.index ? (
                <span className="noa-mono text-[9px] tabular-nums text-muted-foreground/70 group-data-[variant=nav]/tabs-list:data-active:text-foreground/80">
                  {t.index}
                </span>
              ) : null}
              <span>{t.label}</span>
              {t.trailing ? <span className="ml-0.5">{t.trailing}</span> : null}
            </TabsTrigger>
          ))}
        </TabsList>
        {toolbar ? (
          <div className="flex shrink-0 items-center gap-2">{toolbar}</div>
        ) : null}
      </div>

      {tabs.map((t) => (
        <TabsContent key={t.id} value={t.id} className="noa-fade-up">
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
