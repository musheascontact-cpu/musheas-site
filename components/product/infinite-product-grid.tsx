'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { ProductSkeleton } from '../shop/product-skeleton';
import { getPaginatedProducts } from '@/actions/products';
import { Loader2 } from 'lucide-react';

interface InfiniteProductGridProps {
  initialProducts: Product[];
  initialHasMore: boolean;
  dictionary: any;
  lang: string;
  query: string;
  category: string;
}

export function InfiniteProductGrid({
  initialProducts,
  initialHasMore,
  dictionary,
  lang,
  query,
  category
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset when filters change
  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(initialHasMore);
    setPage(1);
  }, [initialProducts, initialHasMore, query, category]);

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
            lang
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
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, page, query, category, lang]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>

      {/* Loading Trigger */}
      {hasMore && (
        <div ref={observerRef} className="py-12 flex flex-col items-center justify-center gap-4">
           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 w-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
           </div>
           <div className="mt-8 flex items-center gap-2 text-muted-foreground font-bold italic">
             <Loader2 className="h-5 w-5 animate-spin" />
             <span>{lang === 'ar' ? 'جاري جلب المزيد...' : 'Loading more...'}</span>
           </div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="py-12 text-center text-muted-foreground font-bold opacity-30">
          {lang === 'ar' ? 'وصلت إلى نهاية القائمة' : 'You have reached the end of the list'}
        </div>
      )}
    </div>
  );
}
