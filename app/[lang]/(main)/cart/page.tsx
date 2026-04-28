"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cartItems, cartTotal, itemCount, lang, dictionary, isCartLoaded } = useCart();
  const currency = dictionary.currency;

  if (!isCartLoaded) {
    return null;
  }

  return (
    <div className="container py-12 md:py-20">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">{dictionary.cart_title}</h1>
      
      {itemCount > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{dictionary.cart_items} ({itemCount})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <CartLineItem item={item} />
                    <Separator className="mt-6" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{dictionary.cart_order_summary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>{dictionary.cart_subtotal}</span>
                  <span>{cartTotal.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{dictionary.cart_shipping}</span>
                  <span>{dictionary.cart_shipping_info}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{dictionary.cart_taxes}</span>
                  <span>{dictionary.cart_taxes_info}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>{dictionary.cart_total}</span>
                  <span>{cartTotal.toFixed(2)} {currency}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full">
                  <Link href={`/${lang}/checkout`}>{dictionary.cart_checkout}</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card py-20 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground/30" suppressHydrationWarning />
            <h2 className="mt-6 text-xl font-semibold">{dictionary.cart_empty}</h2>
            <p className="mt-2 text-muted-foreground">{dictionary.cart_empty_prompt}</p>
            <Button asChild className="mt-6">
               <Link href={`/${lang}/shop`}>{dictionary.cart_start_shopping}</Link>
            </Button>
        </div>
      )}
    </div>
  );
}

    
