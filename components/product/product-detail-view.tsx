"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Product } from '@/lib/types';
import Link from 'next/link';

interface ProductDetailViewProps {
    product: Product;
    categoryName?: string;
}

export function ProductDetailView({ product, categoryName }: ProductDetailViewProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('1');
  const { addToCart, lang, dictionary } = useCart();

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const currency = dictionary.currency;

  // Compute discount percentage
  const discountPct =
    product.salePrice && product.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false); // Do not show toast on "Buy Now"
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
    <div className="container py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
          <Image
            src={product.imageUrl}
            alt={product.name[lang]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint={product.imageHint}
          />
        </div>

        <div className="flex flex-col justify-center">
          {categoryName && <p className="text-sm font-medium text-primary">{categoryName}</p>}
          <h1 className="font-headline text-3xl md:text-4xl font-bold mt-1 text-foreground">
            {product.name[lang]}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.description[lang]}</p>
          
          {product.type === 'b2c' ? (
            <>
              <div className="mt-6 flex items-baseline gap-4 flex-wrap">
                <p className="text-3xl font-bold text-primary">
                  {(product.salePrice || product.price).toFixed(2)} {currency}
                </p>
                {product.salePrice && (
                  <>
                    <p className="text-xl text-muted-foreground line-through">
                      {product.price.toFixed(2)} {currency}
                    </p>
                    {discountPct > 0 && (
                      <span className="inline-flex items-center rounded-full bg-destructive/10 text-destructive px-3 py-1 text-sm font-bold">
                        -{discountPct}%
                      </span>
                    )}
                  </>
                )}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-md border">
                  <Button variant="ghost" size="icon" onClick={decrementQuantity} aria-label={dictionary.cart_decrease_quantity}>
                    <Minus className="h-4 w-4" suppressHydrationWarning />
                  </Button>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    min="1"
                    className="w-12 h-10 text-center bg-transparent border-y-0 border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                  />
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} aria-label={dictionary.cart_increase_quantity}>
                    <Plus className="h-4 w-4" suppressHydrationWarning />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button size="lg" onClick={handleBuyNow}>
                    {dictionary.product_detail_buy_now}
                </Button>
                <Button size="lg" variant="outline" onClick={handleAddToCart}>
                    {dictionary.product_detail_add_to_cart}
                </Button>
              </div>
            </>
          ) : (
             <>
                <Separator className="my-6" />
                <div className="p-4 rounded-lg border border-primary/30 bg-primary/10 space-y-2">
                    <h3 className="font-headline text-lg font-semibold text-primary">{dictionary.b2b_use_disclaimer_title}</h3>
                    <p className="text-sm text-foreground/80">{dictionary.b2b_use_disclaimer_desc}</p>
                </div>
                <Button asChild size="lg" className="mt-6 w-full">
                    <Link href={`/${lang}/contact?product=${product.slug}`}>{dictionary.b2b_inquire_button}</Link>
                </Button>
            </>
          )}


           <div className="mt-8 space-y-4">
            <div>
              <h3 className="font-headline text-lg font-semibold">{dictionary.product_detail_benefits}</h3>
              <ul className="mt-2 space-y-1.5">
                {product.benefits[lang].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" suppressHydrationWarning />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-headline text-lg font-semibold">{dictionary.product_detail_how_to_use}</h3>
              <p className="mt-2 text-muted-foreground">{product.application[lang]}</p>
            </div>
             <div>
              <h3 className="font-headline text-lg font-semibold">{dictionary.product_detail_ingredients}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{product.ingredients[lang].join(lang === 'ar' ? '، ' : ', ')}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
