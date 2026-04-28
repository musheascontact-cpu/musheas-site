"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartLineItem } from "./cart-line-item";
import { Locale } from "@/lib/i18n-config";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSheet({ lang, dictionary, trigger }: { lang: Locale, dictionary: any, trigger?: React.ReactNode }) {
  const { itemCount, cartItems, cartTotal, isCartLoaded } = useCart();
  const currency = dictionary.currency;
  const isAr = lang === 'ar';

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative group" aria-label={dictionary.open_cart_aria_label}>
            <ShoppingBag className="h-6 w-6 text-primary transition-transform group-hover:scale-110" suppressHydrationWarning />
            {isCartLoaded && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 rtl:right-auto rtl:-left-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/40">
                {itemCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg bg-[#020817]/95 backdrop-blur-xl border-white/5 p-0">
        <SheetHeader className="p-6 pb-2 text-right">
          <SheetTitle className="text-2xl font-black tracking-tight text-white flex items-center justify-between">
            <span>{dictionary.cart_title}</span>
            <span className="text-xs uppercase tracking-[0.2em] opacity-40 font-black">
               {isCartLoaded ? itemCount : 0} {isAr ? 'منتجات' : 'Items'}
            </span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="px-6 mb-4">
           <Separator className="bg-white/5" />
        </div>

        {isCartLoaded ? (
          itemCount > 0 ? (
            <>
              <ScrollArea className="flex-grow px-6">
                <div className="flex flex-col gap-6 py-4">
                  {cartItems.map((item) => (
                    <CartLineItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-6 bg-white/[0.02] border-t border-white/5 mt-auto">
                <div className="flex justify-between items-end mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-black opacity-40 mb-1">
                      {dictionary.cart_total}
                    </span>
                    <span className="text-3xl font-black text-white">
                      {cartTotal.toFixed(2)} <span className="text-xs text-primary font-black">{currency}</span>
                    </span>
                  </div>
                  <div className="text-[10px] opacity-30 font-bold uppercase tracking-tighter">
                     {isAr ? 'شامل الضريبة' : 'Inc. VAT'}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                    <Link href={`/${lang}/checkout`}>{dictionary.cart_checkout}</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest text-white/70">
                    <Link href={`/${lang}/cart`}>{dictionary.cart_view_cart}</Link>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-grow flex-col items-center justify-center gap-6 p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-white/10" suppressHydrationWarning />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{dictionary.cart_empty}</h3>
                <p className="text-sm text-white/40 max-w-[200px] mx-auto leading-relaxed">
                  {isAr ? 'سلتك فارغة حالياً، اكتشف منتجاتنا الرائعة وابدأ بالتسوق' : 'Your cart is empty. Explore our innovations and start shopping.'}
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full px-8 border-primary/30 hover:bg-primary/5">
                 <Link href={`/${lang}/products`}>{dictionary.cart_start_shopping}</Link>
              </Button>
            </div>
          )
        ) : (
            <div className="flex-grow p-6 space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-2xl bg-white/5" />
                    <div className="flex-1 space-y-2">
                       <Skeleton className="h-4 w-3/4 bg-white/5" />
                       <Skeleton className="h-4 w-1/2 bg-white/5" />
                    </div>
                  </div>
                ))}
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
