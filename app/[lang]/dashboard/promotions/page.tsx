import { getPromotions } from '@/actions/promotions';
import { Locale } from '@/lib/i18n-config';
import { PromotionDialog } from '@/components/dashboard/promotion-dialog';
import { PromotionActions } from '@/components/dashboard/promotion-actions';
import { Tag, Zap, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default async function PromotionsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const promotions = await getPromotions();
  const isAr = lang === 'ar';

  const activeCount = promotions.filter(p => p.is_active && new Date(p.end_date) > new Date()).length;
  const expiredCount = promotions.filter(p => new Date(p.end_date) <= new Date()).length;

  return (
    <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="h-7 w-7 text-primary" />
            {isAr ? 'العروض والتخفيضات' : 'Promotions & Offers'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAr ? 'إدارة شاملة للعروض المؤقتة وعدادات الاستعجال' : 'Manage urgency timers and limited-time offers across your store'}
          </p>
        </div>
        <PromotionDialog lang={lang} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{promotions.length}</p>
            <p className="text-sm text-muted-foreground">{isAr ? 'إجمالي العروض' : 'Total Promotions'}</p>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">{activeCount}</p>
            <p className="text-sm text-muted-foreground">{isAr ? 'عروض نشطة' : 'Active'}</p>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
            <p className="text-sm text-muted-foreground">{isAr ? 'عروض منتهية' : 'Expired'}</p>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">{isAr ? 'جميع العروض' : 'All Promotions'}</h2>
          <p className="text-sm text-muted-foreground">{promotions.length} {isAr ? 'عرض' : 'promotions'}</p>
        </div>

        {promotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Zap className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">{isAr ? 'لا يوجد عروض بعد' : 'No promotions yet'}</p>
            <p className="text-sm text-muted-foreground/60 mt-1">{isAr ? 'أضف أول عرض لبدء زيادة المبيعات' : 'Add your first promotion to boost sales'}</p>
          </div>
        ) : (
          <div className="divide-y">
            {promotions.map((promo) => {
              const isExpired = new Date(promo.end_date) <= new Date();
              const isRunning = promo.is_active && !isExpired;
              const endDate = new Date(promo.end_date);

              return (
                <div key={promo.id} className="p-5 flex items-center gap-4 flex-wrap">
                  {/* Status indicator */}
                  <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                    isRunning ? 'bg-green-500 animate-pulse' : 
                    isExpired ? 'bg-destructive' : 
                    'bg-yellow-500'
                  }`} />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">{isAr ? promo.title_ar : promo.title_en}</p>
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                        {promo.discount_percentage}% {isAr ? 'خصم' : 'OFF'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider">
                        {promo.apply_to === 'all' ? (isAr ? 'الكل' : 'All') :
                         promo.apply_to === 'category' ? (isAr ? `${promo.category}` : `${promo.category}`) :
                         (isAr ? `منتج محدد` : `Product`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 opacity-70" />
                        <span className="opacity-80">{isAr ? 'ينتهي في:' : 'Ends:'}</span>
                        <span className="text-foreground/80">
                          {new Intl.DateTimeFormat(isAr ? 'ar-DZ' : 'en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          }).format(endDate)}
                        </span>
                      </p>
                      {isExpired && <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded font-bold uppercase tracking-tighter">{isAr ? 'منتهي' : 'Expired'}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <PromotionActions promo={promo} lang={lang} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Help box */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="font-semibold text-primary mb-2">
          {isAr ? '💡 كيف يعمل النظام؟' : '💡 How does it work?'}
        </h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>• {isAr ? 'العرض النشط يظهر تلقائياً في شريط الاستعجال أعلى الموقع' : 'Active promotions appear automatically in the urgency banner at the top of the site'}</li>
          <li>• {isAr ? 'يمكن تطبيق العرض على جميع المنتجات، فئة محددة، أو منتج واحد' : 'Promotions can target all products, a specific category, or a single product'}</li>
          <li>• {isAr ? 'عند انتهاء العرض، يختفي العداد تلقائياً من الموقع' : 'Expired promotions are automatically hidden from the site'}</li>
          <li>• {isAr ? 'العرض بأقرب تاريخ انتهاء هو الذي يظهر في الشريط العلوي' : 'The soonest-expiring active promotion appears in the top banner'}</li>
        </ul>
      </div>
    </div>
  );
}
