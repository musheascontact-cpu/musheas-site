"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimer } from "../ui/countdown-timer";
import { X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import type { Promotion } from "@/actions/promotions";

interface UrgencyBannerProps {
  promotion: Promotion;
  lang: string;
}

export function UrgencyBanner({ promotion, lang }: UrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isVisible) return null;

  const title = lang === 'ar' ? promotion.title_ar : promotion.title_en;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-primary overflow-hidden relative z-50"
      >
        <div className="container mx-auto px-4 py-2.5 md:py-3 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-primary-foreground">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm md:text-base text-center">
            <Sparkles className="h-3 w-3 sm:h-4 sm:h-4 animate-pulse shrink-0" />
            <span className="line-clamp-1 md:line-clamp-none">{title}</span>
          </div>
          
          <CountdownTimer 
            targetDate={promotion.end_date}
            dictionary={{ 
              timer_days: lang === 'ar' ? 'يوم' : 'Days',
              timer_hours: lang === 'ar' ? 'ساعة' : 'Hours',
              timer_minutes: lang === 'ar' ? 'دقيقة' : 'Mins',
              timer_seconds: lang === 'ar' ? 'ثانية' : 'Secs',
            }}
            className="scale-[0.8] sm:scale-90 md:scale-100"
          />

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 text-primary-foreground/50 hover:text-primary-foreground hover:bg-white/10 rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
