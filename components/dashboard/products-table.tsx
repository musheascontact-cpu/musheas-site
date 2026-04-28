"use client";

import React, { useState, useTransition } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Layers, Eye, EyeOff, Loader2 } from "lucide-react";
import { Locale } from '@/lib/i18n-config';
import { ProductDialog } from '@/components/dashboard/product-dialog';
import { DeleteProductButton } from '@/components/dashboard/delete-product-button';
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ProductsTableProps {
  initialProducts: any[];
  lang: Locale;
}

export function ProductsTable({ initialProducts, lang }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const toggleVisibility = async (productId: string, currentVisibility: boolean) => {
    // Optimistic Update
    const previousProducts = [...products];
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, is_visible: !currentVisibility } : p)
    );

    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, is_visible: !currentVisibility }),
      });

      if (!response.ok) throw new Error('Failed to update');
      
      toast({
        title: isAr ? 'تم التحديث' : 'Updated',
        description: isAr ? 'تم تغيير حالة ظهور المنتج' : 'Product visibility updated',
      });
    } catch (error) {
      // Revert on error
      setProducts(previousProducts);
      toast({
        variant: 'destructive',
        title: isAr ? 'خطأ' : 'Error',
        description: isAr ? 'فشل تحديث الحالة' : 'Failed to update visibility',
      });
    }
  };

  const handleDeleteOptimistic = (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="rounded-[2rem] border bg-card/50 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/80 hover:bg-muted/80 border-b-2">
              <TableHead className="w-20 py-5 px-6 font-bold">{isAr ? 'المنتج' : 'Product'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'التفاصيل' : 'Details'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'السعر' : 'Pricing'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'التصنيف' : 'Category'}</TableHead>
              <TableHead className="font-bold">{isAr ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="font-bold text-right px-6">{isAr ? 'إجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} className={cn(
                  "group hover:bg-primary/5 transition-all duration-300",
                  !product.is_visible && "opacity-60"
                )}>
                  <TableCell className="py-4 px-6">
                    <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-background group-hover:border-primary/20 shadow-sm transition-all">
                      <img
                        src={product.image_url}
                        alt=""
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {product.name?.[isAr ? 'ar' : 'en'] ?? product.name?.en ?? '—'}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground uppercase tracking-tighter">
                        {product.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <span className="font-black text-foreground">
                          {product.price?.toLocaleString('en-US')} <span className="text-[10px] text-muted-foreground">DZD</span>

                        </span>
                      </div>
                      {product.sale_price && (
                        <Badge variant="outline" className="w-fit text-[10px] bg-green-500/10 text-green-600 border-green-500/20 py-0 px-2 font-bold">
                          {isAr ? 'تخفيض: ' : 'SALE: '} {product.sale_price?.toLocaleString('en-US')}

                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary/60" />
                        <span className="text-sm font-medium">{product.category}</span>
                      </div>
                      <Badge variant={product.type === 'b2b' ? 'default' : 'outline'} className="w-fit text-[9px] h-4 uppercase font-black tracking-widest px-1.5">
                        {product.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button 
                      onClick={() => toggleVisibility(product.id, product.is_visible)}
                      className="group/toggle"
                    >
                      <Badge 
                        variant={product.is_visible ? "secondary" : "destructive"}
                        className={cn(
                          "font-bold text-[10px] cursor-pointer hover:scale-105 transition-transform",
                          product.is_visible ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''
                        )}
                      >
                        {product.is_visible 
                          ? <><Eye className="w-3 h-3 mr-1" /> {isAr ? 'ظاهر' : 'Visible'}</> 
                          : <><EyeOff className="w-3 h-3 mr-1" /> {isAr ? 'مخفي' : 'Hidden'}</>
                        }
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ProductDialog product={product} lang={lang} />
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name?.[isAr ? 'ar' : 'en'] ?? product.name?.en ?? product.id}
                        lang={lang}
                        onSuccess={() => handleDeleteOptimistic(product.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <div className="p-6 rounded-full bg-muted/50">
                      <Package className="h-12 w-12 opacity-20" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{isAr ? 'المخزن فارغ' : 'Inventory is empty'}</p>
                      <p className="text-sm">{isAr ? 'ابدأ بإضافة أول منتج لمتجرك الآن' : 'Start by adding your first product to the store'}</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List - Hidden on Desktop */}
      <div className="flex flex-col gap-4 p-4 md:hidden">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product.id} 
              className={cn(
                "rounded-2xl border bg-card p-4 shadow-sm space-y-4 transition-all",
                !product.is_visible && "opacity-70 grayscale-[0.5]"
              )}
            >
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 bg-muted shrink-0 shadow-sm">
                  <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">
                    {product.name?.[isAr ? 'ar' : 'en'] ?? product.name?.en ?? '—'}
                  </h3>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter truncate mb-2">
                    {product.slug}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[9px] h-4 uppercase font-black px-1.5">
                      {product.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs font-black text-primary">
                      {product.price?.toLocaleString('en-US')} DZD
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/50">
                <button 
                  onClick={() => toggleVisibility(product.id, product.is_visible)}
                  className="flex items-center gap-2"
                >
                  <Badge 
                    variant={product.is_visible ? "secondary" : "destructive"}
                    className={cn(
                      "font-bold text-[10px] h-8 px-3",
                      product.is_visible ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''
                    )}
                  >
                    {product.is_visible 
                      ? <><Eye className="w-3 h-3 mr-1" /> {isAr ? 'ظاهر' : 'Visible'}</> 
                      : <><EyeOff className="w-3 h-3 mr-1" /> {isAr ? 'مخفي' : 'Hidden'}</>
                    }
                  </Badge>
                </button>

                <div className="flex items-center gap-2">
                  <ProductDialog product={product} lang={lang} />
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name?.[isAr ? 'ar' : 'en'] ?? product.name?.en ?? product.id}
                    lang={lang}
                    onSuccess={() => handleDeleteOptimistic(product.id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50 italic">
             <Package className="h-12 w-12" />
             <p>{isAr ? 'لا توجد منتجات' : 'No products found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
