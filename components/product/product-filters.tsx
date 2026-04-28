"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n-config';

interface ProductFiltersProps {
  categories: Category[];
  lang: Locale;
  dictionary: any;
}

export function ProductFilters({ categories, lang, dictionary }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleFilter = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={currentCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleFilter(null)}
        className={cn(currentCategory === null && "bg-primary text-primary-foreground hover:bg-primary/90")}
      >
        {dictionary.filter_all}
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.slug ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilter(category.slug)}
          className={cn(currentCategory === category.slug && "bg-primary text-primary-foreground hover:bg-primary/90")}
        >
          {category.name[lang]}
        </Button>
      ))}
    </div>
  );
}
