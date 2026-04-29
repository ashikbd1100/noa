"use client";

import { cn } from "@/lib/utils";

export function InlineCopyLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("min-w-0", className)}>{children}</div>;
}
