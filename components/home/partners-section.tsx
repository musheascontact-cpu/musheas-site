'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
}

interface PartnersSectionProps {
  partners: Partner[];
  title: string;
  description: string;
}

function LogoItem({ partner, index }: { partner: Partner; index: number }) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ scale: 1.1, y: -5 }}
      className="relative flex items-center justify-center p-4 h-24 sm:h-32 group"
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Image
        src={partner.logo_url}
        alt={partner.name}
        width={160}
        height={80}
        className="object-contain filter grayscale brightness-125 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
      />
    </motion.div>
  );

  if (partner.website_url) {
    return (
      <Link href={partner.website_url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function PartnersSection({ partners, title, description }: PartnersSectionProps) {
  if (!partners || partners.length === 0) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background decoration - very subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-primary/5 to-transparent opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-4"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-20 md:gap-y-12">
          {partners.map((partner, index) => (
            <LogoItem key={partner.id} partner={partner} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
