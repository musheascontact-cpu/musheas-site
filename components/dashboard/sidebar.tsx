'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Layout, Package, ShoppingCart, Globe, ChevronRight,
  X, Menu, MessageSquare, FileText, Handshake, Mail, Users, Zap, LogOut,
  Share2, ChevronDown, Settings, Bell, Search, Layers
} from 'lucide-react';
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

interface NavGroup {
  label_en: string;
  label_ar: string;
  items: {
    name_en: string;
    name_ar: string;
    href: (lang: string) => string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export default function DashboardSidebar({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAr = lang === 'ar';

  const navGroups: NavGroup[] = [
    {
      label_en: 'Overview',
      label_ar: 'نظرة عامة',
      items: [
        { name_en: 'Dashboard', name_ar: 'الرئيسية', href: (l) => `/${l}/dashboard`, icon: LayoutDashboard },
      ]
    },
    {
      label_en: 'Commerce',
      label_ar: 'التجارة',
      items: [
        { name_en: 'Products', name_ar: 'المنتجات', href: (l) => `/${l}/dashboard/products`, icon: Package },
        { name_en: 'Categories', name_ar: 'التصنيفات', href: (l) => `/${l}/dashboard/categories`, icon: Layers },
        { name_en: 'Promotions', name_ar: 'العروض', href: (l) => `/${l}/dashboard/promotions`, icon: Zap },
        { name_en: 'Orders', name_ar: 'الطلبات', href: (l) => `/${l}/dashboard/orders`, icon: ShoppingCart },
        { name_en: 'Inquiries', name_ar: 'الاستفسارات', href: (l) => `/${l}/dashboard/inquiries`, icon: MessageSquare },
      ]
    },
    {
      label_en: 'Audience',
      label_ar: 'الجمهور',
      items: [
        { name_en: 'Customers', name_ar: 'العملاء', href: (l) => `/${l}/dashboard/customers`, icon: Users },
        { name_en: 'Subscribers', name_ar: 'المشتركون', href: (l) => `/${l}/dashboard/subscribers`, icon: Mail },
        { name_en: 'Partners', name_ar: 'الشركاء', href: (l) => `/${l}/dashboard/partners`, icon: Handshake },
      ]
    },
    {
      label_en: 'Settings',
      label_ar: 'الإعدادات',
      items: [
        { name_en: 'Content', name_ar: 'المحتوى', href: (l) => `/${l}/dashboard/content`, icon: FileText },
        { name_en: 'Footer', name_ar: 'تذييل الموقع', href: (l) => `/${l}/dashboard/footer`, icon: Layout },
        { name_en: 'Social Media', name_ar: 'التواصل الاجتماعي', href: (l) => `/${l}/dashboard/social`, icon: Share2 },
      ]
    },
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
      <div className="flex h-16 items-center px-5 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-primary-foreground font-black text-xs">M</span>
          </div>
          <div>
            <p className="font-black text-sm tracking-wider">MUSHEAS</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        {navGroups.map((group) => (
          <div key={group.label_en}>
            <p className="text-[10px] uppercase text-muted-foreground/50 font-black px-3 mb-2 tracking-widest">
              {isAr ? group.label_ar : group.label_en}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const href = item.href(lang);
                const isActive = pathname === href || (href !== `/${lang}/dashboard` && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-transform", isActive ? "" : "group-hover:scale-110")} />
                    <span className="flex-1">{isAr ? item.name_ar : item.name_en}</span>
                    {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border/50 p-3 space-y-1 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all font-semibold">
              <Globe className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="flex-1 text-left rtl:text-right">{currentLang?.flag} {currentLang?.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="start" side="top">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageSwitch(language.code)}
                disabled={lang === language.code}
                className="gap-2 cursor-pointer font-semibold"
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {lang === language.code && <span className="ml-auto text-xs text-primary font-black">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => signOut({ callbackUrl: `/${lang}/login` })}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 text-destructive hover:bg-destructive/10 w-full text-left rtl:text-right"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {isAr ? 'تسجيل الخروج' : 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card fixed inset-y-0 left-0 z-30 rtl:left-auto rtl:right-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex h-14 items-center justify-between border-b bg-card/90 backdrop-blur-sm px-4 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-[10px]">M</span>
          </div>
          <span className="font-black text-sm tracking-wider">MUSHEAS</span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-card h-full flex flex-col shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-muted transition-colors z-10"
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
