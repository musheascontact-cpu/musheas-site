import { ProductFilters } from '@/components/product/product-filters';
import { getDictionary } from '@/lib/get-dictionary'
import { Locale } from '@/lib/i18n-config'
import { ProductSearch } from '@/components/product/product-search';
import { getPaginatedProducts, getDistinctCategories } from '@/actions/products';
import { InfiniteProductGrid } from '@/components/product/infinite-product-grid';

export const metadata = {
  title: 'Store | MUSHEAS',
  description: 'Explore our collection of mushroom grow kits and supplies for home hobbyists.',
};

export default async function ShopPage({
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
    getDistinctCategories('b2c'),
    getPaginatedProducts({
      page: 0,
      limit: 8,
      query,
      category,
      lang,
      type: 'b2c',
    }),
  ]);

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {dictionary.b2c_page_title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {dictionary.b2c_page_description}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <ProductSearch placeholder={dictionary.b2c_search_placeholder} />
        <ProductFilters categories={categories} lang={lang} dictionary={dictionary} />
      </div>

      <InfiniteProductGrid 
        initialProducts={products}
        initialHasMore={hasMore}
        dictionary={dictionary}
        lang={lang}
        query={query}
        category={category}
        type="b2c"
      />
    </div>
  );
}
