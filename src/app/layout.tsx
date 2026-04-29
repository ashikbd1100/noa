import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NoaShell } from "@/components/noa/noa-shell";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Noa — Human-in-the-loop AI diligence",
  description:
    "Institutional-grade technical diligence scorecards with analyst-validated findings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} min-h-dvh antialiased`}
    >
      <body className="min-h-dvh bg-black">
        <TooltipProvider>
          <NoaShell>{children}</NoaShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
