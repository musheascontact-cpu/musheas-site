import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
        <svg viewBox="0 0 64 64" width="34" height="34" fill="none" aria-hidden="true" suppressHydrationWarning>
            <path d="M12 28c0-10 9-18 20-18s20 8 20 18H12z" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" suppressHydrationWarning/>
            <path d="M28 28v16c0 4 3 7 7 7s7-3 7-7V28" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" suppressHydrationWarning/>
            <path d="M24 46c3 2 5 3 8 3s5-1 8-3" stroke="hsl(var(--primary)/0.75)" strokeWidth="2" strokeLinecap="round" suppressHydrationWarning/>
        </svg>
      <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-primary">
        MUSHEAS
      </span>
    </div>
  );
}
