"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, ShoppingCart, Menu, X, Info, Phone, FlaskConical, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { Locale } from "@/lib/i18n-config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheet } from "../cart/cart-sheet";
import { ProductSearch } from "../product/product-search";
import { Button } from "../ui/button";

interface MobileBottomNavProps {
  lang: Locale;
  dictionary: any;
}

export function MobileBottomNav({ lang, dictionary }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { itemCount, isCartLoaded } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    {
      label: dictionary.nav_home,
      href: `/${lang}`,
      icon: Home,
    },
    {
      label: dictionary.nav_shop,
      href: `/${lang}/shop`,
      icon: ShoppingBag,
    },
    {
      label: dictionary.nav_search,
      onClick: () => setIsSearchOpen(true),
      icon: Search,
    },
    {
      label: dictionary.cart_title,
      isCart: true,
      icon: ShoppingCart,
    },
    {
      label: dictionary.nav_more,
      isMore: true,
      icon: LayoutGrid,
    },
  ];

  const moreLinks = [
    { href: `/${lang}/about`, label: dictionary.nav_about, icon: Info },
    { href: `/${lang}/products`, label: dictionary.nav_b2b, icon: FlaskConical },
    { href: `/${lang}/contact`, label: dictionary.nav_contact, icon: Phone },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pb-safe pointer-events-none">
        <nav className="mx-auto max-w-md h-16 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center justify-around px-2 pointer-events-auto overflow-hidden">
          {navItems.map((item, index) => {
            const isActive = item.href ? pathname === item.href : false;
            
            if (item.isCart) {
              return (
                <div key={index} className="flex flex-col items-center justify-center flex-1 h-full">
                  <CartSheet 
                    lang={lang} 
                    dictionary={dictionary} 
                    trigger={
                      <button className="flex flex-col items-center justify-center gap-1 w-full relative">
                        <div className={cn(
                          "p-1.5 rounded-xl transition-colors",
                          "text-muted-foreground"
                        )}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                        {isCartLoaded && itemCount > 0 && (
                          <span className="absolute top-0 right-1/2 translate-x-4 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                            {itemCount}
                          </span>
                        )}
                      </button>
                    }
                  />
                </div>
              );
            }

            if (item.isMore) {
              return (
                <div key={index} className="flex flex-col items-center justify-center flex-1 h-full">
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className="flex flex-col items-center justify-center gap-1 w-full">
                        <div className="p-1.5 rounded-xl text-muted-foreground">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
                      </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-[2.5rem] p-8 border-t-0 bg-card/95 backdrop-blur-2xl">
                      <SheetHeader className="mb-6">
                        <SheetTitle className="text-center font-headline text-2xl">{dictionary.nav_more}</SheetTitle>
                      </SheetHeader>
                      <div className="grid grid-cols-3 gap-4 pb-8">
                        {moreLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-primary/10 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <link.icon className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xs font-bold text-center leading-tight">{link.label}</span>
                          </Link>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              );
            }

            const Content = (
              <button 
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-1 w-full"
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "text-primary scale-110 bg-primary/10" : "text-muted-foreground"
                )}>
                  <item.icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
                </div>
                <span className={cn(
                  "text-[11px] font-bold tracking-tight transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </button>
            );

            return (
              <div key={index} className="flex flex-col items-center justify-center flex-1 h-full relative">
                {item.href ? (
                  <Link href={item.href} className="w-full h-full flex flex-col items-center justify-center">
                    {Content}
                  </Link>
                ) : Content}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md p-6 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">{dictionary.nav_search}</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSearchOpen(false)}
                  className="rounded-full bg-white/5"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="relative">
                <ProductSearch 
                  placeholder={dictionary.nav_search_placeholder} 
                  onSelect={() => setIsSearchOpen(false)}
                />
              </div>
              <div className="mt-8 flex flex-col gap-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{dictionary.featured_innovations_title}</p>
                <div className="flex flex-wrap gap-2">
                  {moreLinks.map(link => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      onClick={() => setIsSearchOpen(false)}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm hover:bg-primary/10 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
