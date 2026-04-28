"use client";

import { usePathname } from "next/navigation";
import { NoaTopNav, type NavKey } from "@/components/noa/noa-top-nav";
import type { PillarId } from "@/lib/noa-types";

function activeFromPath(pathname: string | null): NavKey {
  if (!pathname || pathname === "/") return "summary";
  const seg = pathname.split("/pillar/")[1]?.split("/")[0];
  if (
    seg === "applications" ||
    seg === "cloud-infra" ||
    seg === "architecture" ||
    seg === "security" ||
    seg === "personnel"
  ) {
    return seg as PillarId;
  }
  return "summary";
}

export function NoaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = activeFromPath(pathname);

  return (
    <div className="relative isolate min-h-screen bg-black text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 noa-binary-bg"
      />
      <NoaTopNav active={active} />
      {children}
      <footer className="border-t border-white/[0.06] py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-2 noa-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="size-1 rounded-full bg-[var(--noa-cyan)]" />
            <span>Noa · Human in the loop</span>
          </div>
          <span className="noa-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Built for serious operators
          </span>
        </div>
      </footer>
    </div>
  );
}
