"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { useRef } from "react";

interface ContactHeroProps {
  image: string;
  dictionary: any;
  isAr: boolean;
}

export function ContactHero({ image, dictionary, isAr }: ContactHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  return (
    <section ref={ref} className="relative h-[60vh] min-h-[450px] flex items-center justify-center text-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Image
            src={image}
            alt="Contact hero"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/40 via-[#020817]/60 to-[#020817]"></div>
      </div>
      
      <motion.div style={{ opacity }} className="container relative z-10">
          <Reveal width="100%" y={50} duration={0.8}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-6">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {isAr ? 'تواصل معنا' : 'Get In Touch'}
              </div>
              <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6">
                  {dictionary.contact_title}
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 font-light leading-relaxed">
                  {dictionary.contact_description}
              </p>
          </Reveal>
      </motion.div>
    </section>
  );
}
