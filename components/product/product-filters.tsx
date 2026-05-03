"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n-config';

interface ProductFiltersProps {
  categories: string[];    // e.g. ["Extracts", "Ferments", "Oils"]
  lang: Locale;
  dictionary: any;
}

export function ProductFilters({ categories, lang, dictionary }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Remove page/query when switching categories for a clean result
    params.delete('page');
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* "All" pill */}
      <button
        onClick={() => handleFilter('')}
        className={cn(
          "h-9 px-4 rounded-full text-sm font-bold border transition-all duration-200",
          !currentCategory
            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background"
        )}
      >
        {dictionary.filter_all || 'All'}
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={cn(
            "h-9 px-4 rounded-full text-sm font-bold border transition-all duration-200",
            currentCategory === cat
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
