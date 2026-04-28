import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/shop/product-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Skeleton */}
      <div className="relative h-[80vh] w-full bg-muted/20 animate-pulse flex items-center justify-center">
        <div className="container mx-auto px-4 space-y-8">
           <Skeleton className="h-16 w-3/4 max-w-2xl rounded-3xl" />
           <Skeleton className="h-6 w-1/2 max-w-md rounded-full" />
           <div className="flex gap-4">
              <Skeleton className="h-14 w-40 rounded-full" />
              <Skeleton className="h-14 w-40 rounded-full" />
           </div>
        </div>
      </div>

      {/* Featured Products Skeleton */}
      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-4">
          <Skeleton className="h-10 w-64 rounded-2xl" />
          <Skeleton className="h-4 w-96 rounded-full" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>

      {/* About/CTA Skeleton */}
      <div className="container mx-auto px-4">
        <Skeleton className="h-[500px] w-full rounded-[3rem]" />
      </div>
    </div>
  );
}
