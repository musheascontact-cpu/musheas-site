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
    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 bg-white/5 border-white/10 hover:bg-primary hover:text-white hover:scale-110 rounded-full transition-all duration-300 shadow-xl"
        onClick={isAr ? scrollNext : scrollPrev}
        disabled={isAr ? !canScrollNext : !canScrollPrev}
      >
        {isAr ? <ArrowRight className="h-6 w-6" /> : <ArrowLeft className="h-6 w-6" />}
      </Button>

      <div className="flex gap-1.5 no-print">
        <div className="h-1 w-24 rounded-full bg-white/10 overflow-hidden relative">
          <motion.div 
            className="absolute inset-0 bg-primary"
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
        className="h-14 w-14 bg-white/5 border-white/10 hover:bg-primary hover:text-white hover:scale-110 rounded-full transition-all duration-300 shadow-xl"
        onClick={isAr ? scrollPrev : scrollNext}
        disabled={isAr ? !canScrollPrev : !canScrollNext}
      >
        {isAr ? <ArrowLeft className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
      </Button>
    </div>
  );
}

export function FeaturedProductsCarousel({ lang, dictionary, featuredProducts }: { lang: Locale, dictionary: any, featuredProducts: Product[] }) {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  if (!featuredProducts || featuredProducts.length === 0) return null;

  const isAr = lang === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full relative group/carousel"
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
              <motion.div 
                initial={{ opacity: 0, x: isAr ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-4 h-[350px] sm:h-[400px] lg:h-[520px]"
              >
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] group transition-all duration-700 hover:border-primary/30">
                    <div className="absolute inset-0 z-0">
                      {product.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={product.name?.[lang] || product.name?.en || 'Product'}
                          fill
                          className="object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full p-8 sm:p-12 md:p-16">
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary backdrop-blur-md"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                          {product.category}
                        </motion.div>
                        
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="font-headline text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl"
                        >
                          {product.name?.[lang] || product.name?.en}
                        </motion.h3>
                        
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-sm sm:text-lg text-white/80 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl font-medium drop-shadow-lg"
                        >
                          {product.description?.[lang] || product.description?.en}
                        </motion.p>
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                      >
                        <Button asChild size="lg" className="rounded-full px-10 shadow-2xl shadow-primary/40 font-black uppercase tracking-widest h-12 sm:h-14 hover:scale-105 transition-transform active:scale-95">
                          <Link href={`/${lang}/products/${product.slug}`}>{dictionary.product_card_details}</Link>
                        </Button>
                        
                        <Button asChild size="lg" variant="outline" className="rounded-full px-10 border-white/30 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest h-12 sm:h-14 hover:scale-105 transition-transform backdrop-blur-md active:scale-95">
                          <Link href={product.type === 'b2b' ? `/${lang}/products` : `/${lang}/shop`}>
                              {product.type === 'b2b' ? dictionary.b2b_section_button : dictionary.b2c_section_button}
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselCustomNav isAr={isAr} />
      </Carousel>
    </motion.div>
  );
}
