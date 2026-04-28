import { ProductGridSkeleton } from "@/components/shop/product-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-12 space-y-4 text-center">
        <div className="h-12 w-64 mx-auto bg-muted/50 animate-pulse rounded-2xl" />
        <div className="h-4 w-96 mx-auto bg-muted/50 animate-pulse rounded-full" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
