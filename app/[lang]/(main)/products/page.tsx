import { ProductFilters } from '@/components/product/product-filters';
import { getDictionary } from '@/lib/get-dictionary'
import { Locale } from '@/lib/i18n-config'
import { ProductSearch } from '@/components/product/product-search';
import { getPaginatedProducts, getDistinctCategories } from '@/actions/products';
import { InfiniteProductGrid } from '@/components/product/infinite-product-grid';

export const metadata = {
  title: 'R&D Center | MUSHEAS',
  description: 'Explore our portfolio of advanced mushroom-based bio-actives.',
};

export default async function ProductsPage({
  searchParams,
  params: { lang }
}: {
  searchParams?: {
    query?: string;
    category?: string;
  };
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang);
  const query = searchParams?.query || '';
  const category = searchParams?.category || '';

  // Fetch real categories and first page of products in parallel
  const [categories, { products, hasMore }] = await Promise.all([
    getDistinctCategories('b2b'),
    getPaginatedProducts({
      page: 0,
      limit: 8,
      query,
      category,
      lang,
      type: 'b2b',
    }),
  ]);

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {dictionary.b2b_page_title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {dictionary.b2b_page_description}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <ProductSearch placeholder={dictionary.b2b_search_placeholder} />
        <ProductFilters categories={categories} lang={lang} dictionary={dictionary} />
      </div>

      <InfiniteProductGrid 
        initialProducts={products}
        initialHasMore={hasMore}
        dictionary={dictionary}
        lang={lang}
        query={query}
        category={category}
        type="b2b"
      />
    </div>
  );
}
