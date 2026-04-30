"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Clock } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { Promotion } from "@/actions/promotions";
import { ProductInquiryDialog } from "./product-inquiry-dialog";

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

  const activePromoFromProduct = (product as any).activePromotion as import('@/actions/promotions').Promotion | null | undefined;
  const targetDateStr = promotion?.end_date || activePromoFromProduct?.end_date || null;

  const discountPct =
    product.salePrice && product.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full h-full"
    >
      <Card
        className={cn(
          "group relative h-full overflow-hidden rounded-[2rem] border-0 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col",
          className
        )}
        style={style}
      >
        <div className="relative w-full aspect-square overflow-hidden">
          <Link 
            href={`/${lang}/products/${product.slug}`} 
            className="absolute inset-0 z-10" 
          />
          
          {product.imageUrl && !imgError ? (
            <motion.img
              src={product.imageUrl}
              alt={product.name[lang]}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <span className="text-[10px] font-black opacity-20 uppercase tracking-[0.5em]">No Image</span>
            </div>
          )}
          
          <AnimatePresence>
            {product.salePrice && (
              <div className="absolute top-4 left-4 z-20 rtl:left-auto rtl:right-4">
                <Badge variant="destructive" className="px-3 py-1 font-black uppercase text-[10px]">
                  {discountPct > 0 ? `-${discountPct}%` : dictionary.product_card_sale_badge}
                </Badge>
              </div>
            )}
          </AnimatePresence>

          <div className="absolute z-20 top-4 right-4 rtl:right-auto rtl:left-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-primary transition-colors border border-white/5"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col p-4 sm:p-6 flex-1 text-center items-center">
          <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-2 min-h-[2.5rem] mb-2 group-hover:text-primary transition-colors">
            {product.name[lang]}
          </h3>
          
          {product.type === 'b2c' ? (
              <div className="w-full mt-auto space-y-3">
                  <div className="flex flex-col items-center">
                      <p className="text-lg font-black text-primary">
                          {formatPrice(product.salePrice || product.price, lang)} <span className="text-[10px]">{currency}</span>
                      </p>
                      {product.salePrice && (
                          <p className="text-[10px] text-muted-foreground line-through opacity-50">
                              {formatPrice(product.price, lang)} {currency}
                          </p>
                      )}
                  </div>
                  <Button
                    className="w-full rounded-full h-11 font-bold text-xs"
                    onClick={handleBuyNow}
                  >
                    {dictionary.product_card_add_to_cart}
                  </Button>
              </div>
          ) : (
              <div className="mt-auto w-full pt-4 space-y-3">
                  <div className="py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                        {dictionary.b2b_use_disclaimer_title}
                      </p>
                  </div>
                  <ProductInquiryDialog product={product as any} lang={lang} dictionary={dictionary} />
              </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
