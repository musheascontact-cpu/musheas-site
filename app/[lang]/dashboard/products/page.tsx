import prisma from '@/lib/prisma';
import { Locale } from '@/lib/i18n-config';
import { ProductDialog } from '@/components/dashboard/product-dialog';
import { ProductsTable } from '@/components/dashboard/products-table';
import { Package } from 'lucide-react';

export default async function DashboardProducts({ params: { lang } }: { params: { lang: Locale } }) {
  const products = await prisma.product.findMany({
    orderBy: { created_at: 'desc' }
  });

  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-br from-card to-muted/50 border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              {isAr ? 'إدارة المنتجات' : 'Products Library'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {isAr
                ? `لديك ${products?.length ?? 0} منتج مفعل في المتجر`
                : `${products?.length ?? 0} active products in your inventory`}
            </p>
          </div>
        </div>
        <ProductDialog lang={lang} />
      </div>

      <ProductsTable initialProducts={products || []} lang={lang} />
    </div>
  );
}
