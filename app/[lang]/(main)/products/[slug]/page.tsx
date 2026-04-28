import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories } from '@/lib/data';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product/product-card';
import { ProductDetailView } from '@/components/product/product-detail-view';
import prisma from '@/lib/prisma';
import { Product } from '@/lib/types';
import { applyPromotionToProduct, applyPromotionsToProducts } from '@/lib/promotions-utils';
import type { Promotion } from '@/actions/promotions';

type Props = {
  params: { slug: string; lang: Locale };
};

import { getProductBySlug } from '@/actions/products';

async function getProduct(slug: string) {
  return await getProductBySlug(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = `${product.name?.[params.lang] ?? product.name?.en ?? ''} | MUSHEAS`;
  const description = (product.description?.[params.lang] ?? product.description?.en ?? '').substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.imageUrl,
          width: 600,
          height: 600,
          alt: product.name?.[params.lang] ?? product.name?.en ?? '',
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { lang, slug } = params;
  const dictionary = await getDictionary(lang);
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }
  
  const now = new Date();

  const [dbRelatedProducts, dbPromotions] = await Promise.all([
    prisma.product.findMany({
      where: {
        category: product.category,
        type: product.type,
        id: { not: product.id }
      },
      take: 4
    }),
    prisma.promotion.findMany({
      where: {
        is_active: true,
        end_date: { gt: now }
      }
    })
  ]);

  const activePromotions: Promotion[] = dbPromotions.map((p: any) => ({
    ...p,
    price: p.price ? Number(p.price) : undefined,
  })) as any;

  const relatedProducts: Product[] = applyPromotionsToProducts(
    dbRelatedProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      salePrice: p.sale_price ? Number(p.sale_price) : undefined,
      imageUrl: p.image_url,
      imageHint: p.image_hint,
      category: p.category,
      ingredients: p.ingredients,
      application: p.application,
      benefits: p.benefits,
      type: p.type,
    })),
    activePromotions
  );

  const category = categories.find(c => c.name.en === product.category);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[lang],
    image: product.imageUrl,
    description: product.description[lang],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'MUSHEAS',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'DZD',
      price: (product.salePrice || product.price).toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product} categoryName={category?.name[lang]} />
      
      {relatedProducts.length > 0 && (
        <div className="container mt-20">
          <Separator />
          <div className="py-12">
            <h2 className="font-headline text-3xl font-bold text-center text-primary mb-8">
              {dictionary.product_detail_related_title}
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((p, index) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
