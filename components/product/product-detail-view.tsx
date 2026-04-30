"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Leaf,
  FlaskConical,
  Hand,
  ChevronRight,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';
import { Reveal } from '@/components/ui/reveal';
import { ProductInquiryDialog } from './product-inquiry-dialog';

interface ProductDetailViewProps {
    product: Product;
    categoryName?: string;
}

export function ProductDetailView({ product, categoryName }: ProductDetailViewProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('1');
  const { addToCart, lang, dictionary } = useCart();
  const isAr = lang === 'ar';

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const currency = dictionary.currency;

  const discountPct =
    product.salePrice && product.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    router.push(`/${lang}/checkout`);
  };
  
  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
    } else {
      setInputValue(String(quantity));
    }
  };

  return (
    <div className="container py-12 md:py-24 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Image Section */}
        <Reveal width="100%" delay={0.1}>
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group-hover:scale-[1.02] transition-transform duration-700 bg-card/50 backdrop-blur-sm">
              <Image
                src={product.imageUrl}
                alt={product.name[lang]}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                 {discountPct > 0 && (
                  <span className="bg-destructive text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg">
                    -{discountPct}% OFF
                  </span>
                )}
                <span className="bg-primary/20 backdrop-blur-md text-primary border border-primary/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                  {product.type === 'b2c' ? 'Retail' : 'Professional Grade'}
                </span>
              </div>
            </div>

            {/* Quality Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Leaf, label: isAr ? 'عضوي 100%' : '100% Organic' },
                { icon: ShieldCheck, label: isAr ? 'نقي ومختبر' : 'Pure & Tested' },
                { icon: Star, label: isAr ? 'جودة فائقة' : 'Premium Quality' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-card/30 border border-white/5 backdrop-blur-md">
                   <item.icon className="h-5 w-5 text-primary" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right: Product Details */}
        <div className="flex flex-col">
          <Reveal delay={0.2}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="h-px w-8 bg-primary/40" />
                 {categoryName && <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{categoryName}</p>}
              </div>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                {product.name[lang]}
              </h1>
              
              {/* Pricing section moved up for impact */}
              {product.type === 'b2c' && (
                <div className="flex items-center gap-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{isAr ? 'السعر' : 'Price'}</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black text-primary">
                        {formatPrice(product.salePrice || product.price, lang)}
                      </span>
                      <span className="text-sm font-bold text-primary/70">{currency}</span>
                    </div>
                  </div>
                  {product.salePrice && (
                    <div className="flex flex-col mt-4 opacity-50">
                       <span className="text-xs font-bold line-through">
                        {formatPrice(product.price, lang)} {currency}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              {product.description[lang]}
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            {product.type === 'b2c' ? (
              <div className="mt-10 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="flex items-center rounded-2xl border border-white/10 bg-card/50 p-1.5 h-14">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={decrementQuantity} 
                      className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className="w-16 h-10 text-center bg-transparent border-none focus-visible:ring-0 text-lg font-black"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={incrementQuantity}
                      className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button size="lg" className="h-14 flex-1 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2" onClick={handleBuyNow}>
                      {dictionary.product_detail_buy_now}
                  </Button>
                </div>
                
                <Button size="lg" variant="outline" className="h-14 w-full rounded-2xl text-lg font-black border-white/10 hover:bg-white/5 transition-all gap-3" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5" />
                    {dictionary.product_detail_add_to_cart}
                </Button>
              </div>
            ) : (
              <div className="mt-10">
                <div className="p-8 rounded-[2rem] border border-primary/20 bg-primary/5 space-y-4 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                       <Zap className="h-24 w-24 text-primary" />
                    </div>
                    <h3 className="font-headline text-2xl font-black text-primary">{dictionary.b2b_use_disclaimer_title}</h3>
                    <p className="text-foreground/80 leading-relaxed font-medium">{dictionary.b2b_use_disclaimer_desc}</p>
                    <ProductInquiryDialog product={product as any} lang={lang} dictionary={dictionary} />
                </div>
              </div>
            )}
          </Reveal>

          {/* Specifications Sections */}
          <div className="mt-12 space-y-6">
            <Reveal delay={0.5}>
              <div className="grid grid-cols-1 gap-4">
                 {/* Benefits Card */}
                <div className="p-8 rounded-[2rem] bg-card/40 border border-white/5 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="font-headline text-xl font-black">{dictionary.product_detail_benefits}</h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.benefits[lang].map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-muted-foreground group">
                        <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                        <span className="font-medium text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* How to use */}
                  <div className="p-8 rounded-[2rem] bg-card/40 border border-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <Hand className="h-5 w-5" />
                      </div>
                      <h3 className="font-headline text-lg font-black">{dictionary.product_detail_how_to_use}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {product.application[lang]}
                    </p>
                  </div>

                  {/* Ingredients */}
                  <div className="p-8 rounded-[2rem] bg-card/40 border border-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <FlaskConical className="h-5 w-5" />
                      </div>
                      <h3 className="font-headline text-lg font-black">{dictionary.product_detail_ingredients}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground/80 font-mono tracking-tight leading-relaxed italic">
                      {product.ingredients[lang].join(lang === 'ar' ? '، ' : ', ')}.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
