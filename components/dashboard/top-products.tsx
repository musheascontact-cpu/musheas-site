'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

export function TopProducts({ products, lang }: { products: any[], lang: string }) {
  const isAr = lang === 'ar';
  
  return (
    <Card className="rounded-[2.5rem] border-2 shadow-xl shadow-black/5 overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-black uppercase tracking-widest opacity-60">
          {isAr ? 'الأكثر مبيعاً' : 'Best Sellers'}
        </CardTitle>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-background shadow-sm">
                    <img src={product.image} alt="" className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-sm font-black truncate max-w-[150px]">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                       {product.quantity} {isAr ? 'قطعة مباعة' : 'units sold'}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm border-2",
                  index === 0 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600" :
                  index === 1 ? "bg-gray-400/10 border-gray-400/20 text-gray-500" :
                  index === 2 ? "bg-orange-400/10 border-orange-400/20 text-orange-600" :
                  "bg-muted border-border text-muted-foreground"
                )}>
                  {index + 1}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-30 italic text-sm">
              {isAr ? 'لا توجد بيانات مبيعات بعد' : 'No sales data yet'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
