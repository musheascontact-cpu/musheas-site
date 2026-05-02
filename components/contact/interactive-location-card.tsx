"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface InteractiveLocationCardProps {
  image: string;
  title: string;
  subtitle: string;
  isAr: boolean;
}

export function InteractiveLocationCard({ image, title, subtitle, isAr }: InteractiveLocationCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full flex justify-center">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
        }}
        className="relative h-[400px] w-full max-w-5xl rounded-[3rem] sm:rounded-[4rem] bg-[#0a1a1e] border border-white/5 overflow-hidden group shadow-2xl shadow-black/50"
      >
        <div
          style={{
            transform: "translateZ(-100px)",
          }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={image}
            alt="Location Context"
            fill
            className="object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a1e] via-transparent to-transparent" />
        </div>

        <div
          style={{
            transform: "translateZ(100px)",
          }}
          className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center"
        >
          <motion.div
             animate={{ 
               y: [0, -10, 0],
               scale: [1, 1.1, 1]
             }}
             transition={{ 
               duration: 4, 
               repeat: Infinity,
               ease: "easeInOut"
             }}
             className="mb-6 relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
            <div className="relative h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-xl">
               <MapPin className="h-10 w-10 text-primary" />
            </div>
          </motion.div>

          <h3 className="text-white font-black text-3xl sm:text-5xl uppercase tracking-tighter mb-4">
            {title}
          </h3>
          
          <p className="text-white/50 text-sm sm:text-lg max-w-md mx-auto leading-relaxed font-light">
            {subtitle}
          </p>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
               {isAr ? "مقرنا الرئيسي" : "Our Headquarters"}
             </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/40 rounded-full blur-[1px]" />
           <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full blur-[2px]" />
           <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/30 rounded-full blur-[1px]" />
        </div>
      </motion.div>
    </div>
  );
}
