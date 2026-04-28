'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Globe, ChevronLeft, X, Menu, MessageSquare, FileText, Handshake, Mail, Users, Zap, LogOut, Share2 } from 'lucide-react';
import { signOut } from "next-auth/react";
import { Locale, i18n } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function DashboardSidebar({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: lang === 'ar' ? 'الرئيسية' : 'Overview', href: `/${lang}/dashboard`, icon: LayoutDashboard },
    { name: lang === 'ar' ? 'المنتجات' : 'Products', href: `/${lang}/dashboard/products`, icon: Package },
    { name: lang === 'ar' ? 'العروض' : 'Promotions', href: `/${lang}/dashboard/promotions`, icon: Zap },
    { name: lang === 'ar' ? 'الطلبات' : 'Orders', href: `/${lang}/dashboard/orders`, icon: ShoppingCart },
    { name: lang === 'ar' ? 'الاستفسارات' : 'Inquiries', href: `/${lang}/dashboard/inquiries`, icon: MessageSquare },
    { name: lang === 'ar' ? 'الشركاء' : 'Partners', href: `/${lang}/dashboard/partners`, icon: Handshake },
    { name: lang === 'ar' ? 'المشتركون' : 'Subscribers', href: `/${lang}/dashboard/subscribers`, icon: Mail },
    { name: lang === 'ar' ? 'العملاء' : 'Customers', href: `/${lang}/dashboard/customers`, icon: Users },
    { name: lang === 'ar' ? 'المحتوى' : 'Content', href: `/${lang}/dashboard/content`, icon: FileText },
    { name: lang === 'ar' ? 'التواصل الاجتماعي' : 'Social Media', href: `/${lang}/dashboard/social`, icon: Share2 },
  ];

  const handleLanguageSwitch = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
  };

  const currentLang = languages.find(l => l.code === lang);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border/50 px-6 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-bold text-sm">MUSHEAS</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        <p className="text-xs uppercase text-muted-foreground/60 font-semibold px-3 mb-3">
          {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${lang}/dashboard` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.name}
              {isActive && <ChevronLeft className="h-3 w-3 ml-auto opacity-60" />}
            </Link>
          );
        })}
        
        <button
          onClick={() => signOut({ callbackUrl: `/${lang}/login` })}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-destructive hover:bg-destructive/10 w-full text-left rtl:text-right"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </nav>

      {/* Language Switcher at bottom */}
      <div className="border-t border-border/50 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
              <Globe className="h-4 w-4 text-primary" />
              <span>{currentLang?.flag} {currentLang?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="start" side="top">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageSwitch(language.code)}
                disabled={lang === language.code}
                className="gap-2 cursor-pointer"
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {lang === language.code && <span className="ml-auto text-xs text-primary">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm">MUSHEAS Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-card h-full flex flex-col shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
