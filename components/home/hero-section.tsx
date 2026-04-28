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
  return (
    <section className="py-10 md:py-16 px-4">
      <div className="container mx-auto">
        <div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-b from-card to-background shadow-2xl shadow-black/50 border border-primary/25 relative flex flex-col justify-center min-h-[600px] md:min-h-[500px]"
          >
            <div className="absolute inset-0 bg-cover bg-center hero-media-bg filter saturate-95 contrast-105"></div>
            
            {/* Animated Glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] animate-pulse-slow pointer-events-none delay-700" />

            <div className="relative p-6 py-20 md:p-16 lg:h-full flex flex-col justify-center gap-6 text-center lg:text-left rtl:lg:text-right">
              
              <Reveal delay={0.2} y={30}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-primary mb-2 shadow-sm">
                   <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {dictionary.hero_subtitle}
                </div>
              </Reveal>

              <Reveal delay={0.4} y={40} width="100%">
                <h1 className="font-headline text-4xl sm:text-5xl lg:text-7xl leading-[1.1] font-black tracking-tight">
                  {dictionary.hero_title_1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">{dictionary.hero_title_2}</span>
                  <br />
                  {dictionary.hero_title_3}
                </h1>
              </Reveal>

              <Reveal delay={0.6} y={30} width="100%">
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  {dictionary.hero_description}
                </p>
              </Reveal>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 items-center lg:items-start justify-center lg:justify-start w-full relative z-10">
                <Reveal delay={0.8} y={20} className="w-full sm:w-auto flex justify-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[320px] sm:max-w-none">
                    <Button size="lg" asChild className="group relative rounded-full w-full px-8 sm:px-12 py-7 sm:py-8 text-base sm:text-lg font-black shadow-[0_10px_40px_-10px_rgba(210,178,107,0.4)] overflow-hidden">
                      <Link href={`/${lang}/products`} className="flex items-center justify-center gap-3">
                        <FlaskConical className="h-5 w-5 group-hover:rotate-12 transition-transform shrink-0" />
                        <span className="relative z-10 truncate">{dictionary.hero_button_b2b}</span>
                        <ArrowRight className={cn("h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 shrink-0", lang === 'ar' && "rotate-180")} />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
                      </Link>
                    </Button>
                  </motion.div>
                </Reveal>
                <Reveal delay={1.0} y={20} className="w-full sm:w-auto flex justify-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[320px] sm:max-w-none">
                    <Button size="lg" variant="outline" asChild className="group rounded-full w-full px-8 sm:px-12 py-7 sm:py-8 text-base sm:text-lg font-bold border-white/20 hover:bg-white/5 backdrop-blur-md transition-all shadow-xl">
                      <Link href={`/${lang}/shop`} className="flex items-center justify-center gap-3">
                        <Store className="h-5 w-5 text-primary group-hover:scale-110 transition-transform shrink-0" />
                        <span className="truncate">{dictionary.hero_button_b2c}</span>
                      </Link>
                    </Button>
                  </motion.div>
                </Reveal>
              </div>

              <div className="flex flex-col gap-6 mt-8">
                <Reveal delay={1.2} y={10}>
                  <div className="text-[10px] text-white/40 tracking-[0.3em] font-black uppercase">
                    {dictionary.hero_b2b_inquiry}
                  </div>
                </Reveal>

                <Reveal delay={1.4} y={20} className="self-center lg:self-start">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-white/5 to-transparent p-1.5 pr-6 rtl:pr-1.5 rtl:pl-6 backdrop-blur-xl shadow-2xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <svg width="28" height="18" viewBox="0 0 3 2" className="rounded-[4px] shadow-sm overflow-hidden">
                          <rect width="1.5" height="2" fill="#006233" />
                          <rect x="1.5" width="1.5" height="2" fill="#fff" />
                          <circle cx="1.6" cy="1" r="0.5" fill="#d21034" />
                          <circle cx="1.75" cy="1" r="0.5" fill="#fff" />
                          <path
                            fill="#d21034"
                            d="M1.95 1l-.09-.03.04-.09-.04-.09.09-.03.04.09.09-.03-.04.09.04.09-.09-.03-.04.09z"
                            transform="translate(-0.1, 0.05)"
                          />
                      </svg>
                    </div>
                    <div className="flex flex-col items-start rtl:items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none mb-1">Authentic Quality</span>
                      <span className="text-sm font-bold text-white/90 leading-none">{dictionary.hero_algerian_made}</span>
                    </div>
                  </motion.div>
                </Reveal>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
