import { getDistinctCategories } from '@/actions/products';
import { Locale } from '@/lib/i18n-config';
import { Layers, Package, Plus, Sparkles } from 'lucide-react';
import { CategoryManagerList } from '@/components/dashboard/category-manager-list';
import prisma from '@/lib/prisma';

export default async function DashboardCategories({ params: { lang } }: { params: { lang: Locale } }) {
  const isAr = lang === 'ar';
  
  // Get categories and count products for each
  const categories = await getDistinctCategories('all');
  
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await prisma.product.count({
        where: { category: cat }
      });
      return { name: cat, productCount: count };
    })
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-card via-card to-primary/5 border shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 rounded-3xl bg-primary/10 text-primary shadow-inner">
            <Layers className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {isAr ? 'إدارة التصنيفات' : 'Categories Manager'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              {isAr
                ? `لديك ${categories.length} تصنيفات نشطة حالياً`
                : `${categories.length} active categories in your store`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <CategoryManagerList initialCategories={categoriesWithCounts} lang={lang} />
    </div>
  );
}
