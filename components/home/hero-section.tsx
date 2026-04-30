"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, FlaskConical, Store } from "lucide-react";

interface HeroSectionProps {
  dictionary: any;
  lang: string;
}

export function HeroSection({ dictionary, lang }: HeroSectionProps) {
  const isAr = lang === 'ar';
  
  return (
    <section className="py-8 md:py-12 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] overflow-hidden bg-card/20 border border-white/5 backdrop-blur-sm relative min-h-[500px] md:min-h-[550px] flex items-center shadow-xl"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-cover bg-center hero-media-bg opacity-40 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full p-8 md:p-16 lg:p-24 flex flex-col items-center lg:items-start text-center lg:text-left rtl:lg:text-right gap-6">
            
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase font-bold tracking-[0.2em] text-primary">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                 {dictionary.hero_subtitle}
              </div>
            </Reveal>

            <Reveal delay={0.2} width="100%">
              <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl leading-[1.1] font-bold tracking-tight max-w-3xl">
                {dictionary.hero_title_1} <span className="text-primary">{dictionary.hero_title_2}</span>
                <br />
                {dictionary.hero_title_3}
              </h1>
            </Reveal>

            <Reveal delay={0.3} width="100%">
              <p className="text-base md:text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
                {dictionary.hero_description}
              </p>
            </Reveal>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Reveal delay={0.4}>
                <Button size="lg" asChild className="rounded-full px-10 h-14 bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  <Link href={`/${lang}/products`} className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    {dictionary.hero_button_b2b}
                    <ArrowRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-1", isAr && "rotate-180")} />
                  </Link>
                </Button>
              </Reveal>
              <Reveal delay={0.5}>
                <Button size="lg" variant="outline" asChild className="rounded-full px-10 h-14 border-white/10 bg-white/5 backdrop-blur-md font-bold transition-all hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0">
                  <Link href={`/${lang}/shop`} className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {dictionary.hero_button_b2c}
                  </Link>
                </Button>
              </Reveal>
            </div>

            {/* Quality Badge - More Minimal */}
            <Reveal delay={0.6} className="mt-6">
              <div className="flex items-center gap-4 p-2 pr-6 rtl:pr-2 rtl:pl-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <svg width="24" height="16" viewBox="0 0 30 20">
                        <rect width="15" height="20" fill="#006233" />
                        <rect x="15" width="15" height="20" fill="#fff" />
                        <path d="M19 10a5 5 0 1 0-7.3 4.5 4 4 0 1 1 0-9 5 5 0 0 0 0 9 5 5 0 0 0 7.3-4.5z" fill="#d21034" />
                        <path d="M18.5 10l-1.1.8.4-1.3-1.1-.8 1.4 0 .4-1.3.4 1.3 1.4 0-1.1.8.4 1.3-1.1-.8z" fill="#d21034" />
                    </svg>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{dictionary.hero_algerian_made}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-tighter">Certified Excellence</span>
                 </div>
              </div>
            </Reveal>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
