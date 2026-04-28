"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Clock } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { Promotion } from "@/actions/promotions";

/** Compact single-row countdown shown inside the card content area */
function CountdownInline({ targetDate, dictionary }: { targetDate: string; dictionary: any }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calc = () => {
      const diff = +new Date(targetDate) - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1 bg-destructive/10 border border-destructive/20 rounded-full px-3 py-1">
      <Clock className="h-3 w-3 text-destructive shrink-0" />
      <span className="text-[11px] font-bold text-destructive tabular-nums">
        {timeLeft.days > 0 && <>{pad(timeLeft.days)}<span className="opacity-60 mx-0.5">{dictionary.timer_days?.slice(0,1) || 'd'}</span></>}
        {pad(timeLeft.hours)}<span className="opacity-60 mx-0.5">{dictionary.timer_hours?.slice(0,1) || 'h'}</span>
        {pad(timeLeft.minutes)}<span className="opacity-60 mx-0.5">{dictionary.timer_minutes?.slice(0,1) || 'm'}</span>
        {pad(timeLeft.seconds)}<span className="opacity-60 mx-0.5">{dictionary.timer_seconds?.slice(0,1) || 's'}</span>
      </span>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
  promotion?: Promotion | null;
}

export function ProductCard({ product, className, style, promotion }: ProductCardProps) {
  const { addToCart, lang, dictionary } = useCart();
  const router = useRouter();
  const currency = dictionary.currency;
  const [imgError, setImgError] = useState(false);

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, false);
    router.push(`/${lang}/checkout`);
  };

  // Use real promotion end date: passed-in prop takes priority, then activePromotion baked into product
  const activePromoFromProduct = (product as any).activePromotion as import('@/actions/promotions').Promotion | null | undefined;
  const targetDateStr = promotion?.end_date || activePromoFromProduct?.end_date || null;

  // Compute discount percentage from price and salePrice
  const discountPct =
    product.salePrice && product.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full"
    >
      <Card
        className={cn(
          "group relative h-full overflow-hidden rounded-[2rem] border-0 glass-card transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/20 flex flex-col",
          className
        )}
        style={style}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-primary/5">
          <Link 
            href={`/${lang}/products/${product.slug}`} 
            className="absolute inset-0 z-10" 
            aria-label={dictionary.product_card_view_product.replace('{productName}', product.name[lang])} 
          />
          
          {product.imageUrl && !imgError ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="h-full w-full relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name[lang]}
                className="absolute inset-0 w-full h-full object-cover"
                data-ai-hint={product.imageHint}
                onError={() => setImgError(true)}
              />
            </motion.div>
          ) : (
            /* Branded fallback - Enhanced for premium feel */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-primary/5 to-transparent">
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
                />
                <svg viewBox="0 0 120 120" className="w-24 h-24 relative z-10 drop-shadow-2xl" fill="none">
                  <circle cx="60" cy="60" r="50" stroke="currentColor" className="text-primary/20" strokeWidth="0.5" strokeDasharray="4 4" />
                  <path d="M30 70 Q35 35 60 30 Q85 35 90 70" fill="currentColor" className="text-primary/40" />
                  <rect x="54" y="70" width="12" height="25" rx="5" fill="currentColor" className="text-primary/50" />
                  <circle cx="45" cy="50" r="4" fill="white" fillOpacity="0.2" />
                  <circle cx="75" cy="45" r="3" fill="white" fillOpacity="0.1" />
                </svg>
              </div>
              <p className="text-[11px] tracking-[0.4em] text-primary/60 font-black uppercase mt-4">MUSHEAS</p>
            </div>
          )}
          
          <AnimatePresence>
            {product.salePrice && (
              <motion.div
                key="sale-badge"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute top-4 left-4 z-20 rtl:left-auto rtl:right-4"
              >
                <Badge variant="destructive" className="px-3 py-1 shadow-lg shadow-destructive/20 text-xs font-black uppercase tracking-wider">
                  {discountPct > 0 ? `-${discountPct}%` : dictionary.product_card_sale_badge}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute z-20 top-4 right-4 rtl:right-auto rtl:left-4"
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-primary hover:text-white border border-white/10"
              aria-label={dictionary.product_card_add_to_wishlist}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center p-3 sm:p-6 text-center flex-1">
          <motion.h3 
            className="font-bold text-base sm:text-lg leading-[1.2] text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.4rem] mb-2"
          >
            <Link href={`/${lang}/products/${product.slug}`}>
              {product.name[lang]}
            </Link>
          </motion.h3>
          
          {product.type === 'b2c' ? (
              <div className="w-full mt-auto">
                  {/* Compact countdown strip - shown below name when promotion is active */}
                  {targetDateStr && product.salePrice && (
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-primary/80">
                      <CountdownInline targetDate={targetDateStr} dictionary={dictionary} />
                    </div>
                  )}
                  <div className="mt-2 flex flex-col items-center">
                      <p className="text-xl font-black text-primary">
                          {(product.salePrice || product.price).toFixed(2)}{' '}
                          <span className="text-xs font-medium uppercase opacity-80">{currency}</span>
                      </p>
                      {product.salePrice && (
                          <p className="text-sm text-muted-foreground line-through opacity-60">
                              {product.price.toFixed(2)} {currency}
                          </p>
                      )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 w-full"
                  >
                    <Button
                      className="w-full rounded-full py-6 font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                      onClick={handleBuyNow}
                    >
                      {dictionary.product_card_add_to_cart}
                    </Button>
                  </motion.div>
              </div>
          ) : (
              <div className="mt-auto w-full pt-4 space-y-3">
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-primary/80">
                        {dictionary.b2b_use_disclaimer_title}
                      </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button asChild className="w-full rounded-full py-6" variant="outline">
                        <Link href={`/${lang}/contact?product=${product.slug}`}>
                          {dictionary.b2b_inquire_button}
                        </Link>
                    </Button>
                  </motion.div>
              </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
