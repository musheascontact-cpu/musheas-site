"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string; // ISO format
  dictionary: any;
  className?: string;
  onExpire?: () => void;
}

export const CountdownTimer = ({ targetDate, dictionary, className, onExpire }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
        if (onExpire) onExpire();
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (!timeLeft) return null;

  const items = [
    { label: dictionary.timer_days || "Days", value: timeLeft.days },
    { label: dictionary.timer_hours || "Hours", value: timeLeft.hours },
    { label: dictionary.timer_minutes || "Mins", value: timeLeft.minutes },
    { label: dictionary.timer_seconds || "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="flex flex-col items-center">
            <div className="relative min-w-[40px] md:min-w-[50px] h-10 md:h-12 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={item.value}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-lg md:text-xl font-black text-primary"
                >
                  {item.value.toString().padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold text-white/60">
              {item.label}
            </span>
          </div>
          {index < items.length - 1 && (
            <span className="text-primary font-bold text-lg mb-4">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
