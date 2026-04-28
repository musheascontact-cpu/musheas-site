"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const ProductSearch = dynamic(() => import("../product/product-search").then(mod => mod.ProductSearch), {
  ssr: false,
  loading: () => <div className="h-12 w-full bg-white/5 animate-pulse rounded-full" />
});

const CartSheet = dynamic(() => import("../cart/cart-sheet").then(mod => mod.CartSheet), {
  ssr: false
});
import LanguageSwitcher from "./language-switcher";
import type { Locale } from "@/lib/i18n-config";
import { Search, X, Menu } from "lucide-react";

export function Header({ lang, dictionary }: { lang: Locale, dictionary: any }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}/about`, label: dictionary.nav_about },
    { href: `/${lang}/products`, label: dictionary.nav_b2b },
    { href: `/${lang}/shop`, label: dictionary.nav_shop },
    { href: `/${lang}/contact`, label: dictionary.nav_contact },
  ];

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-3 py-4 md:py-3.5">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${lang}`} aria-label={dictionary.logo_aria_label} onClick={() => setDrawerOpen(false)}>
                <Logo />
              </Link>
            </motion.div>
            <nav className="hidden lg:flex items-center gap-2 text-sm uppercase tracking-widest text-white/90" aria-label="Primary">
              {navLinks.map((link) => (
                <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={link.href}
                    className="px-2.5 py-2.5 rounded-xl hover:bg-primary/10 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Search Bar - Desktop Centered */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4 relative">
             <AnimatePresence>
               {isSearchOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: -10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: -10, scale: 0.95 }}
                   className="w-full"
                 >
                   <ProductSearch placeholder={dictionary.nav_search_placeholder || "Search products..."} />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Desktop Search Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/5 rounded-full h-10 w-10"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>
            </motion.div>

            <div className="hidden lg:block" suppressHydrationWarning>
                <LanguageSwitcher />
            </div>
            
            <div className="hidden xl:flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" className="bg-primary/10 border-primary/40 hover:bg-primary/20 text-xs rounded-full">
                    <Link href={`/${lang}/contact`}>{dictionary.nav_request_catalog}</Link>
                </Button>
              </motion.div>
            </div>

            <div suppressHydrationWarning className="flex items-center gap-2">
              <CartSheet lang={lang} dictionary={dictionary} />
            </div>

            {/* Mobile Menu Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-11 h-11 rounded-2xl border border-primary/30 bg-white/5 flex items-center justify-center overflow-hidden"
                onClick={() => setDrawerOpen(!isDrawerOpen)}
                aria-label={dictionary.open_menu_aria_label}
              >
                <AnimatePresence mode="wait">
                  {isDrawerOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-primary/20 overflow-hidden"
            >
              <div className="py-6 px-1 flex flex-col gap-1">
                <div className="px-2 mb-6">
                   <ProductSearch placeholder={dictionary.nav_search_placeholder || "Search..."} />
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="px-2.5 py-4 rounded-xl text-white/90 hover:bg-primary/10 border-b border-white/5 last:border-0 block font-medium"
                         onClick={() => setDrawerOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-3 mt-6 pt-6 border-t border-primary/20"
                >
                    <Button asChild className="h-12 rounded-2xl font-bold">
                        <Link href={`/${lang}/products`} onClick={() => setDrawerOpen(false)}>{dictionary.nav_b2b}</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-2xl border-primary/30 font-bold">
                        <Link href={`/${lang}/shop`} onClick={() => setDrawerOpen(false)}>{dictionary.nav_shop}</Link>
                    </Button>
                </motion.div>
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="mt-6 pt-6 border-t border-primary/20 flex justify-center pb-6" 
                   suppressHydrationWarning
                >
                  <LanguageSwitcher />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
