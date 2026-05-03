"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Clock, Check, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
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

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1 bg-destructive/10 border border-destructive/20 rounded-full px-3 py-1">
      <Clock className="h-3 w-3 text-destructive shrink-0" />
      <span className="text-[11px] font-bold text-destructive tabular-nums">
        {timeLeft.days > 0 && <>{pad(timeLeft.days)}<span className="opacity-60 mx-0.5">{dictionary.timer_days?.slice(0, 1) || "d"}</span></>}
        {pad(timeLeft.hours)}<span className="opacity-60 mx-0.5">{dictionary.timer_hours?.slice(0, 1) || "h"}</span>
        {pad(timeLeft.minutes)}<span className="opacity-60 mx-0.5">{dictionary.timer_minutes?.slice(0, 1) || "m"}</span>
        {pad(timeLeft.seconds)}<span className="opacity-60 mx-0.5">{dictionary.timer_seconds?.slice(0, 1) || "s"}</span>
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
  const [isLiked, setIsLiked] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);

  // Spring scale for image press
  const imageScale = useSpring(1, { stiffness: 400, damping: 22 });

  const handleBuyNow = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product, 1, false);
      // Visual feedback flash
      setAddedFlash(true);
      setTimeout(() => setAddedFlash(false), 1400);
    },
    [addToCart, product]
  );

  const handleLike = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLiked((prev) => !prev);
    },
    []
  );

  const activePromoFromProduct = (product as any).activePromotion as import("@/actions/promotions").Promotion | null | undefined;
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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="w-full h-full"
      style={{ WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
    >
      <Card
        className={cn(
          "group relative h-full overflow-hidden rounded-[1.6rem] border-0 bg-card/40 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col",
          className
        )}
        style={style}
      >
        <Link
          href={`/${lang}/products/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={product.name[lang]}
          style={{ WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
        />

        {/* Image Area */}
        <div
          className="relative w-full aspect-square overflow-hidden"
          onTouchStart={() => imageScale.set(0.97)}
          onTouchEnd={() => imageScale.set(1)}
          onTouchCancel={() => imageScale.set(1)}
        >


          {product.imageUrl && !imgError ? (
            <motion.img
              src={product.imageUrl}
              alt={product.name[lang]}
              style={{ scale: imageScale }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <span className="text-[10px] font-black opacity-20 uppercase tracking-[0.5em]">No Image</span>
            </div>
          )}

          {/* Gradient overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10" />

          {/* Sale Badge */}
          <AnimatePresence>
            {product.salePrice && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-3 left-3 z-20 rtl:left-auto rtl:right-3"
              >
                <Badge variant="destructive" className="px-2.5 py-0.5 font-black uppercase text-[10px] shadow-lg shadow-destructive/30">
                  {discountPct > 0 ? `-${discountPct}%` : dictionary.product_card_sale_badge}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heart / Like Button */}
          <div className="absolute z-20 top-3 right-3 rtl:right-auto rtl:left-3">
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.75 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="h-8 w-8 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center border border-white/10"
              style={{ WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
              aria-label={dictionary.product_card_add_to_wishlist}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5 transition-all duration-200",
                    isLiked ? "fill-red-500 text-red-500" : "text-white/80"
                  )}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-col p-3 sm:p-5 flex-1 text-center items-center overflow-hidden">
          <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.6rem] mb-2 group-hover:text-primary transition-colors w-full break-words hyphens-auto">
            {product.name[lang]}
          </h3>

          {product.type === "b2c" ? (
            <div className="w-full mt-auto space-y-2.5">
              <div className="flex flex-col items-center">
                <p className="text-base font-black text-primary">
                  {formatPrice(product.salePrice || product.price, lang)}{" "}
                  <span className="text-[10px]">{currency}</span>
                </p>
                {product.salePrice && (
                  <p className="text-[10px] text-muted-foreground line-through opacity-50">
                    {formatPrice(product.price, lang)} {currency}
                  </p>
                )}
              </div>

              {/* Add to Cart Button with animated flash feedback */}
              <motion.button
                onClick={handleBuyNow}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "w-full rounded-full h-10 font-bold text-[11px] sm:text-xs transition-all duration-300 flex items-center justify-center gap-1.5 overflow-hidden relative z-20",
                  addedFlash
                    ? "bg-green-500 text-white shadow-green-500/30 shadow-lg"
                    : "bg-primary text-primary-foreground shadow-primary/20 shadow-md hover:bg-primary/90"
                )}
                style={{ WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
              >
                <AnimatePresence mode="wait">
                  {addedFlash ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{lang === "ar" ? "تمت الإضافة!" : "Added!"}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="buy"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      <span>{dictionary.product_card_add_to_cart}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          ) : (
              <div className="mt-auto w-full pt-3 space-y-2.5 relative z-20">
                <div className="py-1 px-3 rounded-full bg-primary/10 border border-primary/20 w-full">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary text-center break-words">
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
