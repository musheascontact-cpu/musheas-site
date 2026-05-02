"use client";

import { motion, useTransform, useSpring, useScroll, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, FlaskConical, Store, ChevronDown } from "lucide-react";
import { useRef, useCallback, useState } from "react";

interface HeroSectionProps {
  dictionary: any;
  lang: string;
}

export function HeroSection({ dictionary, lang }: HeroSectionProps) {
  const isAr = lang === "ar";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouching, setIsTouching] = useState(false);

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Tilt effect on touch (mobile)
  const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (touch.clientX - cx) / rect.width;
      const dy = (touch.clientY - cy) / rect.height;
      rotateX.set(-dy * 6);
      rotateY.set(dx * 6);
    },
    [rotateX, rotateY]
  );

  const resetTilt = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setIsTouching(false);
  }, [rotateX, rotateY]);

  return (
    <section className="py-4 sm:py-8 md:py-12 px-3 sm:px-4" ref={containerRef}>
      <div className="container mx-auto">
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          onTouchStart={() => setIsTouching(true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={resetTilt}
          className={cn(
            "rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-card/20 border border-white/5 backdrop-blur-sm relative min-h-[480px] sm:min-h-[500px] md:min-h-[550px] flex items-center shadow-xl transition-shadow duration-300",
            isTouching && "shadow-primary/10 shadow-2xl"
          )}
        >
          {/* Background with parallax */}
          <div className="absolute inset-0 z-0">
            <motion.div
              style={{ y: bgY }}
              className="absolute inset-0 scale-110 bg-cover bg-center hero-media-bg opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            {/* Animated glow pulse on touch */}
            <AnimatedGlowRing active={isTouching} />
          </div>

          <motion.div
            style={{ y: textY, opacity }}
            className="relative z-10 w-full p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col items-center lg:items-start text-center lg:text-left rtl:lg:text-right gap-5 sm:gap-6"
          >
            {/* Subtitle pill */}
            <Reveal delay={0.1}>
              <motion.div
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase font-bold tracking-[0.2em] text-primary cursor-default"
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {dictionary.hero_subtitle}
              </motion.div>
            </Reveal>

            {/* Main heading */}
            <Reveal delay={0.2} width="100%">
              <h1
                className={cn(
                  "font-headline text-[1.85rem] sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl",
                  isAr ? "leading-[1.3]" : "leading-[1.1]"
                )}
              >
                {dictionary.hero_title_1}{" "}
                <span className="text-primary relative inline-block">
                  {dictionary.hero_title_2}
                  {/* underline accent */}
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/40 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                    style={{ originX: isAr ? 1 : 0 }}
                  />
                </span>
                <br className="hidden sm:block" />
                {dictionary.hero_title_3}
              </h1>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.3} width="100%">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl font-light leading-relaxed text-wrap-balance">
                {dictionary.hero_description}
              </p>
            </Reveal>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
              <Reveal delay={0.4}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97, y: 0 }}>
                  <Button
                    size="lg"
                    asChild
                    className="rounded-full px-8 h-13 sm:h-14 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30 w-full sm:w-auto"
                  >
                    <Link href={`/${lang}/products`} className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 shrink-0" />
                      <span>{dictionary.hero_button_b2b}</span>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isAr && "rotate-180"
                        )}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </Reveal>

              <Reveal delay={0.5}>
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97, y: 0 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full px-8 h-13 sm:h-14 border-white/10 bg-white/5 backdrop-blur-md font-bold transition-all hover:bg-white/10 w-full sm:w-auto"
                  >
                    <Link href={`/${lang}/shop`} className="flex items-center gap-2">
                      <Store className="h-4 w-4 shrink-0" />
                      {dictionary.hero_button_b2c}
                    </Link>
                  </Button>
                </motion.div>
              </Reveal>
            </div>

            {/* Quality Badge */}
            <Reveal delay={0.6} className="mt-4 sm:mt-6">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-4 p-2 pr-5 rtl:pr-2 rtl:pl-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm cursor-default select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <svg width="22" height="15" viewBox="0 0 30 20">
                    <rect width="15" height="20" fill="#006233" />
                    <rect x="15" width="15" height="20" fill="#fff" />
                    <path d="M19 10a5 5 0 1 0-7.3 4.5 4 4 0 1 1 0-9 5 5 0 0 0 0 9 5 5 0 0 0 7.3-4.5z" fill="#d21034" />
                    <path d="M18.5 10l-1.1.8.4-1.3-1.1-.8 1.4 0 .4-1.3.4 1.3 1.4 0-1.1.8.4 1.3-1.1-.8z" fill="#d21034" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                    {dictionary.hero_algerian_made}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-tighter">
                    Certified Excellence
                  </span>
                </div>
              </motion.div>
            </Reveal>
          </motion.div>

          {/* Scroll hint on mobile */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:hidden"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-white/20" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Animated glow that activates on touch
function AnimatedGlowRing({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 border-2 border-primary/20 rounded-[2rem]" />
          <div className="absolute inset-0 bg-primary/5" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
