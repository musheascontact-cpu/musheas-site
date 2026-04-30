import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FeaturedProductsCarousel } from '@/components/home/featured-products-carousel';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/lib/i18n-config';
import { ProductCard } from '@/components/product/product-card';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { Product } from '@/lib/types';
import { HeroSection } from '@/components/home/hero-section';
import { Reveal } from '@/components/ui/reveal';
import { getPromotions, Promotion } from '@/actions/promotions';
import { applyPromotionsToProducts } from '@/lib/promotions-utils';

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(lang);
  const title = `${dictionary.hero_title_1} ${dictionary.hero_title_2} ${dictionary.hero_title_3}`;
  return {
    title: {
      absolute: `MUSHEAS — ${title}`,
    },
    description: dictionary.hero_description,
  };
}

export default async function HomePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  
  const [dbProducts, partners] = await Promise.all([
    prisma.product.findMany({
      where: { is_visible: true }
    }),
    prisma.partner.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' }
    })
  ]);
  
  const products: Product[] = dbProducts.map((p: any) => ({
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
    is_visible: p.is_visible,
    is_featured: p.is_featured
  }));

  const allPromotions = await getPromotions();
  const activePromos = allPromotions.filter(p => p.is_active && new Date(p.end_date) > new Date());

  const productsWithPromotions = applyPromotionsToProducts(products, activePromos as any);

  const featuredB2BProducts = productsWithPromotions.filter(p => p.type === 'b2b' || p.type === 'rd').slice(0, 5);
  const featuredB2CProducts = productsWithPromotions.filter(p => p.type === 'b2c').slice(0, 5);
  const allFeaturedProducts = productsWithPromotions.filter(p => p.is_featured);

  return (
    <main>
      <HeroSection dictionary={dictionary} lang={lang} />

      <section className="py-20 px-4">
        <div className="container mx-auto">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
                <Reveal width="100%" delay={0.1} y={30} className="flex-1">
                    <h2 className="font-headline text-3xl sm:text-4xl text-primary tracking-wider">{dictionary.featured_innovations_title}</h2>
                    <p className="text-white/70 max-w-2xl mt-2 text-lg font-light">{dictionary.featured_innovations_description}</p>
                </Reveal>
            </div>
          <FeaturedProductsCarousel 
            lang={lang} 
            dictionary={dictionary} 
            featuredProducts={allFeaturedProducts} 
          />
        </div>
      </section>

       <section id="b2b-products" className="py-20 section-optimized">
        <div className="container mx-auto">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
               <Reveal delay={0.1} y={20} width="100%" className="flex-1">
                  <h2 className="font-headline text-3xl sm:text-4xl text-primary tracking-wider">{dictionary.b2b_section_title}</h2>
                  <p className="text-white/70 max-w-2xl mt-2 text-lg font-light">{dictionary.b2b_section_description}</p>
               </Reveal>
               <Reveal delay={0.2} y={10}>
                 <Button asChild variant="outline" className="rounded-full px-8 py-5 sm:py-6 border-primary/30 w-full sm:w-auto">
                     <Link href={`/${lang}/products`}>{dictionary.b2b_section_button}</Link>
                 </Button>
               </Reveal>
           </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featuredB2BProducts.map((p, index) => (
              <ProductCard 
                key={p.id} 
                product={p}
              />
            ))}
          </div>
        </div>
      </section>

      {partners && partners.length > 0 && (
        <section id="partners" className="py-20 bg-primary/5 section-optimized">
          <div className="container mx-auto">
            <Reveal width="100%" delay={0.1} y={20}>
              <div className="text-center mb-16">
                <h2 className="font-headline text-4xl text-primary tracking-wider">{dictionary.partners_section_title}</h2>
                <p className="text-white/70 max-w-2xl mt-2 mx-auto text-lg font-light">{dictionary.partners_section_description}</p>
              </div>
            </Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-12">
              {partners.map((partner, i) => (
                <Reveal key={partner.id} delay={0.1 + (i * 0.05)} y={10}>
                  {partner.website_url ? (
                    <Link href={partner.website_url} target="_blank" rel="noopener noreferrer" className="block group">
                       <Image
                        src={partner.logo_url}
                        alt={partner.name}
                        width={160}
                        height={80}
                        className="object-contain filter grayscale brightness-200 contrast-0 transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:scale-110"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      width={160}
                      height={80}
                      className="object-contain filter grayscale brightness-200 contrast-0 transition-all duration-500 hover:grayscale-0 hover:brightness-100 hover:contrast-100 hover:scale-110"
                    />
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

       <section id="shop" className="py-20 bg-card/10 section-optimized">
        <div className="container mx-auto">
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
               <Reveal delay={0.1} y={20} width="100%" className="flex-1">
                  <h2 className="font-headline text-3xl sm:text-4xl text-primary tracking-wider">{dictionary.b2c_section_title}</h2>
                  <p className="text-white/70 max-w-2xl mt-2 text-lg font-light">{dictionary.b2c_section_description}</p>
               </Reveal>
               <Reveal delay={0.2} y={10}>
                 <Button asChild variant="outline" className="rounded-full px-8 py-5 sm:py-6 border-primary/30 w-full sm:w-auto">
                     <Link href={`/${lang}/shop`}>{dictionary.b2c_section_button}</Link>
                 </Button>
               </Reveal>
           </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featuredB2CProducts.map((p, index) => (
              <ProductCard 
                key={p.id} 
                product={p}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
