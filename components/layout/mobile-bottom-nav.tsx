"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, ShoppingBag, ShoppingCart,
  Info, Phone, FlaskConical, LayoutGrid, X
} from "lucide-react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
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

function RippleButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const createRipple = useCallback(
    (e: React.PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    },
    []
  );

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden select-none", className)}
      onPointerDown={createRipple}
      onClick={onClick}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-primary/20 pointer-events-none"
          style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40 }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function MobileBottomNav({ lang, dictionary }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { itemCount, isCartLoaded } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isAr = lang === "ar";

  const navItems = [
    { label: dictionary.nav_home, href: `/${lang}`, icon: Home, id: "home" },
    { label: dictionary.nav_shop, href: `/${lang}/shop`, icon: ShoppingBag, id: "shop" },
    { label: dictionary.nav_search || "بحث", onClick: () => setIsSearchOpen(true), icon: Search, id: "search" },
    { label: isAr ? "السلة" : "Cart", isCart: true, icon: ShoppingCart, id: "cart" },
    { label: dictionary.nav_more || "المزيد", isMore: true, icon: LayoutGrid, id: "more" },
  ];

  const moreLinks = [
    { href: `/${lang}/about`, label: dictionary.nav_about, icon: Info, color: "from-blue-500/20 to-blue-600/5" },
    { href: `/${lang}/products`, label: dictionary.nav_b2b, icon: FlaskConical, color: "from-primary/20 to-primary/5" },
    { href: `/${lang}/contact`, label: dictionary.nav_contact, icon: Phone, color: "from-green-500/20 to-green-600/5" },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <nav
          className="mx-auto max-w-md h-[68px] bg-[#0a1a1e]/90 backdrop-blur-2xl border border-white/10 rounded-[22px] shadow-2xl shadow-black/40 flex items-stretch px-1 relative overflow-hidden"
          style={{ boxShadow: "0 -1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 60px rgba(0,0,0,0.5)" }}
        >
          {/* Glass highlight stripe */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {navItems.map((item, index) => {
            const isActive = item.href ? pathname === item.href : false;

            if (item.isCart) {
              return (
                <div key={item.id} className="flex flex-col items-center justify-center flex-1 h-full">
                  <CartSheet
                    lang={lang}
                    dictionary={dictionary}
                    trigger={
                      <RippleButton className="flex flex-col items-center justify-center gap-1 w-full h-full rounded-2xl cursor-pointer">
                        <div className="relative">
                          <motion.div
                            whileTap={{ scale: 0.85 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="p-1.5 rounded-xl text-muted-foreground"
                          >
                            <item.icon className="h-5 w-5" />
                          </motion.div>
                          <AnimatePresence>
                            {isCartLoaded && itemCount > 0 && (
                              <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground shadow-lg shadow-primary/50"
                              >
                                {itemCount}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        <span className="text-[10px] font-semibold tracking-tight text-muted-foreground">{item.label}</span>
                      </RippleButton>
                    }
                  />
                </div>
              );
            }

            if (item.isMore) {
              return (
                <div key={item.id} className="flex flex-col items-center justify-center flex-1 h-full">
                  <Sheet>
                    <SheetTrigger asChild>
                      <RippleButton className="flex flex-col items-center justify-center gap-1 w-full h-full rounded-2xl cursor-pointer">
                        <motion.div
                          whileTap={{ scale: 0.85 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="p-1.5 rounded-xl text-muted-foreground"
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>
                        <span className="text-[10px] font-semibold tracking-tight text-muted-foreground">{item.label}</span>
                      </RippleButton>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="rounded-t-[2.5rem] border-t-0 bg-[#0a1a1e]/95 backdrop-blur-2xl p-0 overflow-hidden"
                      style={{ maxHeight: "70vh" }}
                    >
                      {/* Drag handle */}
                      <div className="flex justify-center pt-4 pb-2">
                        <div className="w-10 h-1 rounded-full bg-white/20" />
                      </div>
                      <SheetHeader className="px-6 pb-4">
                        <SheetTitle className="text-center font-headline text-xl text-white/90">
                          {dictionary.nav_more}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="grid grid-cols-3 gap-3 px-6 pb-8">
                        {moreLinks.map((link, i) => (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Link
                              href={link.href}
                              className={cn(
                                "flex flex-col items-center gap-3 p-4 rounded-3xl bg-gradient-to-b border border-white/5 active:scale-95 transition-transform",
                                link.color
                              )}
                              style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                <link.icon className="h-6 w-6 text-primary" />
                              </div>
                              <span className="text-xs font-bold text-center leading-tight text-white/80">
                                {link.label}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              );
            }

            const NavContent = (
              <RippleButton className="flex flex-col items-center justify-center gap-1 w-full h-full rounded-2xl cursor-pointer relative">
                <motion.div
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 transition-all duration-200", isActive && "scale-110")} />
                </motion.div>

                <span className={cn(
                  "text-[10px] font-semibold tracking-tight transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>

                {/* Active dot indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-dot"
                      className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    />
                  )}
                </AnimatePresence>
              </RippleButton>
            );

            return (
              <div key={item.id} className="flex flex-col items-center justify-center flex-1 h-full">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {NavContent}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {NavContent}
                  </button>
                )}
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsSearchOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-[#0a1a1e] rounded-t-[2.5rem] p-6 border-t border-white/10"
              style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-5">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-white">{dictionary.nav_search || "بحث"}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="rounded-full bg-white/5 hover:bg-white/10 text-white/60"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ProductSearch
                placeholder={dictionary.nav_search_placeholder || (isAr ? "ابحث عن منتج..." : "Search products...")}
                onSelect={() => setIsSearchOpen(false)}
              />

              <div className="mt-6 flex flex-wrap gap-2">
                {[dictionary.nav_shop, dictionary.nav_b2b, dictionary.nav_about].filter(Boolean).map((label, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-white/50 font-medium"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
