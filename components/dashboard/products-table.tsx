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
import { upsertProduct } from "@/actions/products";
import { Button } from "@/components/ui/button";

interface ProductsTableProps {
  initialProducts: any[];
  lang: Locale;
}

export function ProductsTable({ initialProducts, lang }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const toggleVisibility = async (product: any) => {
    const productId = product.id;
    const currentVisibility = product.is_visible;

    // Optimistic Update
    const previousProducts = [...products];
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, is_visible: !currentVisibility } : p)
    );

    try {
      const updatedData = {
        ...product,
        name_en: product.name?.en,
        name_ar: product.name?.ar,
        description_en: product.description?.en,
        description_ar: product.description?.ar,
        ingredients_en: product.ingredients?.en?.join(', '),
        ingredients_ar: product.ingredients?.ar?.join(', '),
        application_en: product.application?.en,
        application_ar: product.application?.ar,
        benefits_en: product.benefits?.en?.join(', '),
        benefits_ar: product.benefits?.ar?.join(', '),
        is_visible: !currentVisibility
      };

      const result = await upsertProduct(updatedData);

      if (!result.success) throw new Error(result.error);
      
      toast({
        title: isAr ? 'تم التحديث بذكاء' : 'Intelligently Updated',
        description: isAr ? 'تم تغيير حالة ظهور المنتج' : 'Product visibility updated successfully',
      });
    } catch (error: any) {
      setProducts(previousProducts);
      toast({
        variant: 'destructive',
        title: isAr ? 'فشل التحديث' : 'Update Failed',
        description: error.message || (isAr ? 'حدث خطأ أثناء تغيير الحالة' : 'Error updating visibility'),
      });
    }
  };

  const handleDeleteOptimistic = (productId: string) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <span className="font-bold text-primary">
            {isAr ? `${selectedIds.length} منتجات مختارة` : `${selectedIds.length} products selected`}
          </span>
          <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => setSelectedIds([])} className="rounded-xl">{isAr ? 'إلغاء' : 'Clear'}</Button>
          </div>
        </div>
      )}

      <div className="rounded-[2.5rem] border bg-card/50 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 hover:shadow-primary/5">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-2">
                <TableHead className="w-12 px-6">
                   <input 
                    type="checkbox" 
                    onChange={(e) => setSelectedIds(e.target.checked ? products.map(p => p.id) : [])}
                    checked={selectedIds.length === products.length && products.length > 0}
                    className="h-4 w-4 rounded border-muted bg-background text-primary"
                   />
                </TableHead>
                <TableHead className="w-20 py-6 px-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground">{isAr ? 'المنتج' : 'Product'}</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">{isAr ? 'التفاصيل' : 'Details'}</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">{isAr ? 'التسعير' : 'Pricing'}</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">{isAr ? 'التصنيف' : 'Category'}</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">{isAr ? 'الحالة' : 'Status'}</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right px-6">{isAr ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id} className={cn(
                    "group hover:bg-primary/[0.03] transition-all duration-300 border-b last:border-0",
                    !product.is_visible && "opacity-60 grayscale-[0.2]"
                  )}>
                    <TableCell className="px-6">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="h-4 w-4 rounded border-muted bg-background text-primary"
                      />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="relative h-16 w-16 rounded-[1.25rem] overflow-hidden border-2 border-background group-hover:border-primary/20 shadow-lg transition-all duration-500">
                        <img
                          src={product.image_url}
                          alt=""
                          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-black text-foreground group-hover:text-primary transition-colors text-lg">
                          {product.name?.[isAr ? 'ar' : 'en'] ?? product.name?.en ?? '—'}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                          {product.slug}
                          {product.is_featured && <Badge className="h-4 text-[8px] bg-amber-500 hover:bg-amber-600 border-none font-black px-1.5 rounded-full">FEATURED</Badge>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-foreground text-lg">
                            {product.price?.toLocaleString('en-US')}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground">DZD</span>
                        </div>
                        {product.sale_price && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground line-through opacity-50">{product.price}</span>
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[9px] font-black px-1.5 h-4">
                               SALE
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          <span className="text-sm font-bold text-muted-foreground">{product.category}</span>
                        </div>
                        <Badge variant="outline" className="w-fit text-[9px] h-4 uppercase font-black tracking-widest border-primary/20 text-primary px-2 bg-primary/5">
                          {product.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => toggleVisibility(product)}
                        className="group/toggle relative flex items-center justify-center h-10 w-24 rounded-2xl bg-muted/50 overflow-hidden transition-all hover:ring-2 hover:ring-primary/20"
                      >
                        <div className={cn(
                          "absolute inset-0 transition-all duration-500",
                          product.is_visible ? "bg-green-500/10" : "bg-destructive/10"
                        )} />
                        <div className="relative flex items-center gap-2 font-black text-[10px] uppercase">
                          {product.is_visible 
                            ? <><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> <span className="text-green-600">{isAr ? 'ظاهر' : 'Live'}</span></> 
                            : <><div className="w-1.5 h-1.5 rounded-full bg-destructive" /> <span className="text-destructive">{isAr ? 'مخفي' : 'Hidden'}</span></>
                          }
                        </div>
                      </button>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
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
                  <TableCell colSpan={7} className="h-96 text-center">
                    <div className="flex flex-col items-center gap-6 text-muted-foreground">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl animate-pulse" />
                        <Package className="h-20 w-20 relative opacity-20" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-foreground">{isAr ? 'المخزن خالٍ تماماً' : 'The Vault is Empty'}</p>
                        <p className="text-sm font-medium max-w-xs mx-auto mt-2">
                          {isAr ? 'ابدأ بإضافة منتجاتك الفريدة لتعرضها للعالم بلمسة واحدة.' : 'Start adding your unique products to showcase them to the world with one touch.'}
                        </p>
                      </div>
                      <ProductDialog lang={lang} />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 p-4 md:hidden">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className={cn(
                  "relative rounded-[2rem] border bg-card p-5 shadow-sm space-y-4 transition-all overflow-hidden",
                  !product.is_visible && "opacity-80 grayscale-[0.3]"
                )}
              >
                <div className="flex gap-5">
                  <div className="h-24 w-24 rounded-[1.5rem] overflow-hidden border-2 bg-muted shrink-0 shadow-lg">
                    <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-black text-lg leading-tight truncate">
                      {product.name?.[isAr ? 'ar' : 'en'] ?? product.name?.en ?? '—'}
                    </h3>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest truncate mt-1">
                      {product.slug}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 text-base font-black text-primary">
                        {product.price?.toLocaleString('en-US')} <span className="text-[10px] text-muted-foreground">DZD</span>
                      </div>
                      <Badge variant="outline" className="text-[8px] h-4 uppercase font-black px-1.5 border-primary/20 bg-primary/5 text-primary">
                        {product.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
                  <button 
                    onClick={() => toggleVisibility(product)}
                    className={cn(
                      "flex items-center gap-2 h-10 px-4 rounded-2xl font-black text-[10px] uppercase transition-all",
                      product.is_visible ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {product.is_visible 
                      ? <><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {isAr ? 'ظاهر' : 'Live'}</> 
                      : <><div className="w-1.5 h-1.5 rounded-full bg-destructive" /> {isAr ? 'مخفي' : 'Hidden'}</>
                    }
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
    </div>
  );
}
