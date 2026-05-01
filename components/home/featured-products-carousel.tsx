'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import type { Product } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Locale } from '@/lib/i18n-config';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function CarouselCustomNav({ isAr }: { isAr: boolean }) {
  const { scrollNext, scrollPrev, canScrollNext, canScrollPrev } = useCarousel();
  
  return (
    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white rounded-full transition-all duration-300"
        onClick={isAr ? scrollNext : scrollPrev}
        disabled={isAr ? !canScrollNext : !canScrollPrev}
      >
        {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
      </Button>

      <div className="flex gap-1 no-print">
        <div className="h-0.5 w-16 rounded-full bg-white/10 overflow-hidden relative">
          <motion.div 
            className="absolute inset-0 bg-primary/60"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ originX: isAr ? 1 : 0 }}
          />
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white rounded-full transition-all duration-300"
        onClick={isAr ? scrollPrev : scrollNext}
        disabled={isAr ? !canScrollPrev : !canScrollNext}
      >
        {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export function FeaturedProductsCarousel({ lang, dictionary, featuredProducts }: { lang: Locale, dictionary: any, featuredProducts: Product[] }) {
  const plugin = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (!featuredProducts || featuredProducts.length === 0) return null;

  const isAr = lang === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="w-full relative"
    >
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
          direction: isAr ? 'rtl' : 'ltr',
          align: 'start',
        }}
      >
        <CarouselContent>
          {featuredProducts.map((product, index) => (
            <CarouselItem key={product.id}>
              <div className="p-2 h-[400px] lg:h-[480px]">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm shadow-xl transition-all duration-500 hover:border-white/20">
                    {/* Background Layer */}
                    <div className="absolute inset-0 z-0">
                      {product.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={product.name?.[lang] || product.name?.en || 'Product'}
                          fill
                          className="object-cover opacity-40 transition-transform duration-[3000ms] group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-12">
                      <div className="max-w-2xl space-y-4">
                        <div className="flex items-center gap-2">
                           <span className="h-px w-6 bg-primary/60" />
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                             {product.category}
                           </span>
                        </div>
                        
                        <h3 className="font-headline text-3xl md:text-5xl font-bold text-white tracking-tight">
                          {product.name?.[lang] || product.name?.en}
                        </h3>
                        
                        <p className="text-sm md:text-base text-white/70 line-clamp-2 max-w-xl font-light">
                          {product.description?.[lang] || product.description?.en}
                        </p>

                        <div className="pt-4 flex flex-wrap gap-4">
                          <Button asChild className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all hover:translate-y-[-2px] active:translate-y-0">
                            <Link href={`/${lang}/products/${product.slug}`}>{dictionary.product_card_details}</Link>
                          </Button>
                          
                          <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all hover:translate-y-[-2px] active:translate-y-0 backdrop-blur-md">
                            <Link href={product.type === 'b2b' ? `/${lang}/products` : `/${lang}/shop`}>
                                {product.type === 'b2b' ? dictionary.b2b_section_button : dictionary.b2c_section_button}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselCustomNav isAr={isAr} />
      </Carousel>
    </motion.div>
  );
}
