"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Zap, 
  LayoutGrid,
  MessageSquare,
  Handshake,
  Mail,
  Users,
  FileText,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Locale } from "@/lib/i18n-config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardBottomNavProps {
  lang: Locale;
}

export function DashboardBottomNav({ lang }: DashboardBottomNavProps) {
  const pathname = usePathname();

  const isAr = lang === 'ar';

  const mainItems = [
    { name: isAr ? 'الرئيسية' : 'Overview', href: `/${lang}/dashboard`, icon: LayoutDashboard },
    { name: isAr ? 'المنتجات' : 'Products', href: `/${lang}/dashboard/products`, icon: Package },
    { name: isAr ? 'الطلبات' : 'Orders', href: `/${lang}/dashboard/orders`, icon: ShoppingCart },
    { name: isAr ? 'العروض' : 'Promotions', href: `/${lang}/dashboard/promotions`, icon: Zap },
    { name: isAr ? 'المزيد' : 'More', isMore: true, icon: LayoutGrid },
  ];

  const moreItems = [
    { name: isAr ? 'الاستفسارات' : 'Inquiries', href: `/${lang}/dashboard/inquiries`, icon: MessageSquare },
    { name: isAr ? 'الشركاء' : 'Partners', href: `/${lang}/dashboard/partners`, icon: Handshake },
    { name: isAr ? 'المشتركون' : 'Subscribers', href: `/${lang}/dashboard/subscribers`, icon: Mail },
    { name: isAr ? 'العملاء' : 'Customers', href: `/${lang}/dashboard/customers`, icon: Users },
    { name: isAr ? 'المحتوى' : 'Content', href: `/${lang}/dashboard/content`, icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pb-safe pointer-events-none">
      <nav className="mx-auto max-w-md h-16 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex items-center justify-around px-2 pointer-events-auto">
        {mainItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          if (item.isMore) {
            return (
              <div key={index} className="flex-1 h-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground hover:text-primary transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span className="text-[11px] font-bold tracking-tight">{item.name}</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-[2rem] p-6 bg-card/95 backdrop-blur-2xl border-t-0">
                    <SheetHeader className="mb-4">
                      <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-4" />
                      <SheetTitle className="text-center text-lg font-bold">{item.name}</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-3 gap-4 pb-10">
                      {moreItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200",
                            pathname === subItem.href 
                              ? "bg-primary/15 text-primary border border-primary/20 shadow-sm shadow-primary/5" 
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <subItem.icon className="h-5 w-5" />
                          <span className="text-[11px] font-bold text-center leading-tight">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href || '#'}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 relative rounded-xl",
                isActive ? "text-primary scale-110 font-black bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-primary/10")} />
              <span className="text-[11px] tracking-tight">{item.name}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
