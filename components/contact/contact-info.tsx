"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContactInfoItem {
  icon: ReactNode;
  title: string;
  value: string;
  href?: string;
}

interface ContactInfoProps {
  items: ContactInfoItem[];
}

export function ContactInfo({ items }: ContactInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-500"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                {item.title}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-white font-bold hover:text-primary transition-colors"
                  dir="ltr"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-white font-bold" dir="ltr">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
