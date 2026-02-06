import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">ScoreHeroes</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/matches" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Matches
            </Link>
            <Link href="/teams" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Teams
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
