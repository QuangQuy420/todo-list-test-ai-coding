import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLinks } from "@/components/nav-links";
import { CheckSquare } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo",
  description: "Modern todo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="glass-header flex items-center justify-between px-5 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <CheckSquare className="size-5 text-accent-violet" aria-hidden="true" />
              <span className="text-sm font-semibold tracking-wide text-foreground">Todos</span>
            </div>
            <NavLinks />
            <ThemeToggle />
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
