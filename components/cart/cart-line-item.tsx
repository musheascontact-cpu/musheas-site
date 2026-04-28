"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { UpdateCartButton } from "./update-cart-button";

interface CartLineItemProps {
  item: CartItem;
}

export function CartLineItem({ item }: CartLineItemProps) {
  const { removeFromCart, lang, dictionary } = useCart();
  const currency = dictionary.currency;
  const price = item.product.salePrice ?? item.product.price;
  const isAr = lang === 'ar';

  return (
    <div className="group relative flex items-center gap-4 py-2">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1.5rem] bg-white/5 border border-white/5 transition-transform group-hover:scale-105 duration-500">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name[lang]}
          fill
          className="object-cover"
          sizes="96px"
          data-ai-hint={item.product.imageHint}
        />
      </div>

      <div className="flex flex-1 flex-col self-stretch justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link href={`/${lang}/products/${item.product.slug}`} className="text-sm font-black text-white hover:text-primary transition-colors line-clamp-1">
              {item.product.name[lang]}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all -mt-1 -mr-2"
              onClick={() => removeFromCart(item.product.id)}
              aria-label={dictionary.cart_remove_product}
            >
              <Trash2 className="h-3 w-3" suppressHydrationWarning />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-xs font-black text-primary">
               {price.toFixed(2)} {currency}
             </span>
             {item.product.salePrice && (
               <span className="text-[10px] text-white/20 line-through font-bold">
                 {item.product.price.toFixed(2)}
               </span>
             )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <UpdateCartButton productId={item.product.id} quantity={item.quantity} />
          <div className="text-right">
             <span className="text-[10px] uppercase tracking-tighter font-black opacity-20 block leading-none mb-1">
               {isAr ? 'المجموع' : 'Subtotal'}
             </span>
             <span className="text-sm font-black text-white">
               {(price * item.quantity).toFixed(2)}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
