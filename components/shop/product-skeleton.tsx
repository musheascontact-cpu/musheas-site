import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
  return (
    <div className="group relative flex flex-col gap-4 p-4 rounded-[2.5rem] border bg-card/50">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full rounded-[2rem]" />
      
      {/* Content Skeleton */}
      <div className="space-y-3 px-2 pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        
        {/* Button Skeleton */}
        <div className="pt-4">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
