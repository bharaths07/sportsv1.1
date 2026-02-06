import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t py-6 md:py-0", className)}>
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by ScoreHeroes Team. The source code is available on GitHub.
        </p>
      </div>
    </footer>
  );
}
