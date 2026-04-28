import { Skeleton } from '@/components/ui/skeleton';

export function ProductsLoadingSkeleton() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Skeleton className="h-10 w-full md:max-w-xs" />
        <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-full">
             <div className="group w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="relative w-full aspect-square overflow-hidden">
                    <Skeleton className="h-full w-full" />
                </div>
                <div className="flex flex-col items-center p-3 text-center space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-10 w-full mt-1" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
