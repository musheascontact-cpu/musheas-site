'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { ProductSkeleton } from '../shop/product-skeleton';
import { getPaginatedProducts } from '@/actions/products';
import { Loader2, PackageSearch } from 'lucide-react';

interface InfiniteProductGridProps {
  initialProducts: Product[];
  initialHasMore: boolean;
  dictionary: any;
  lang: string;
  query: string;
  category: string;   // Raw category string from DB, e.g. "Extracts"
  type?: 'b2b' | 'b2c';
}

export function InfiniteProductGrid({
  initialProducts,
  initialHasMore,
  dictionary,
  lang,
  query,
  category,
  type = 'b2b',
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset when filters change (new server render)
  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialHasMore);
    setPage(1);
  }, [initialProducts, initialHasMore, query, category]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);

          const result = await getPaginatedProducts({
            page,
            limit: 8,
            query,
            category,
            lang,
            type,
          });

          if (result.products.length > 0) {
            setProducts((prev) => [...prev, ...result.products]);
            setPage((prev) => prev + 1);
            setHasMore(result.hasMore);
          } else {
            setHasMore(false);
          }

          setIsLoading(false);
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, page, query, category, lang, type]);

  if (products.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <PackageSearch className="h-16 w-16 opacity-20" />
        <p className="font-bold text-lg">
          {lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching products found'}
        </p>
        <p className="text-sm opacity-60">
          {lang === 'ar' ? 'جرّب تغيير الفلتر أو البحث' : 'Try changing the filter or search term'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={observerRef} className="py-12 flex flex-col items-center justify-center gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-muted-foreground font-bold text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{lang === 'ar' ? 'جاري جلب المزيد...' : 'Loading more...'}</span>
          </div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground font-bold opacity-40">
          {lang === 'ar' ? '— وصلت إلى نهاية القائمة —' : '— End of list —'}
        </div>
      )}
    </div>
  );
}
