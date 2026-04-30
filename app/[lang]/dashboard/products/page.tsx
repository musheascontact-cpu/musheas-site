import prisma from '@/lib/prisma';
import { Locale } from '@/lib/i18n-config';
import { ProductDialog } from '@/components/dashboard/product-dialog';
import { ProductsTable } from '@/components/dashboard/products-table';
import { Package } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default async function DashboardProducts({ params: { lang } }: { params: { lang: Locale } }) {
  const products = await prisma.product.findMany({
    orderBy: { created_at: 'desc' }
  });

  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-card via-card to-primary/5 border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 rounded-3xl bg-primary/10 text-primary shadow-inner">
            <Package className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {isAr ? 'إدارة المنتجات' : 'Products Library'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              {isAr
                ? `لديك ${products?.length ?? 0} منتج مفعل في المتجر`
                : `${products?.length ?? 0} active products in your inventory`}
            </p>
          </div>
        </div>
        <ProductDialog lang={lang} />
      </div>

      <ErrorBoundary>
        <ProductsTable initialProducts={products || []} lang={lang} />
      </ErrorBoundary>
    </div>
  );
}
