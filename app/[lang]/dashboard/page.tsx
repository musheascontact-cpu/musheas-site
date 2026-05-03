import { getDashboardStats } from '@/actions/analytics';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown, Activity, Calendar, ArrowUpRight, Zap, MessageSquare, Mail } from "lucide-react"
import { Locale } from '@/lib/i18n-config';
import { RevenueChart, StatusPieChart } from '@/components/dashboard/analytics-charts';
import { TopProducts } from '@/components/dashboard/top-products';
import { RealtimeDashboardSync } from '@/components/dashboard/realtime-sync';
import Link from 'next/link';

export default async function DashboardOverview({ params: { lang } }: { params: { lang: Locale } }) {
  const stats = await getDashboardStats();
  const isAr = lang === 'ar';

  if (!stats) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      {isAr ? 'خطأ في تحميل البيانات' : 'Error loading stats'}
    </div>
  );

  const summaryStats = [
    {
      title: isAr ? 'إجمالي المبيعات' : 'Total Revenue',
      value: `${stats.counts.revenue.toLocaleString('en-US')}`,
      unit: 'DZD',
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      trend: '+12.5%',
      trendUp: true,
      href: null,
    },
    {
      title: isAr ? 'الطلبات' : 'Total Orders',
      value: stats.counts.orders,
      unit: '',
      icon: ShoppingCart,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      trend: '+8.2%',
      trendUp: true,
      href: `/${lang}/dashboard/orders`,
    },
    {
      title: isAr ? 'المنتجات' : 'Products',
      value: stats.counts.products,
      unit: '',
      icon: Package,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      trend: '0%',
      trendUp: true,
      href: `/${lang}/dashboard/products`,
    },
    {
      title: isAr ? 'المشتركين' : 'Subscribers',
      value: stats.counts.subscribers,
      unit: '',
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      trend: '+3.1%',
      trendUp: true,
      href: `/${lang}/dashboard/subscribers`,
    },
  ];

  const quickActions = [
    { title: isAr ? 'إضافة منتج' : 'Add Product', icon: Package, href: `/${lang}/dashboard/products`, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: isAr ? 'عرض الطلبات' : 'View Orders', icon: ShoppingCart, href: `/${lang}/dashboard/orders`, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { title: isAr ? 'الاستفسارات' : 'Inquiries', icon: MessageSquare, href: `/${lang}/dashboard/inquiries`, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: isAr ? 'إدارة العروض' : 'Promotions', icon: Zap, href: `/${lang}/dashboard/promotions`, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: isAr ? 'المشتركون' : 'Subscribers', icon: Mail, href: `/${lang}/dashboard/subscribers`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: isAr ? 'المحتوى' : 'Content', icon: Activity, href: `/${lang}/dashboard/content`, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      <RealtimeDashboardSync />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black tracking-tight">
              {isAr ? 'لوحة التحكم' : 'Dashboard'}
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20 uppercase tracking-widest">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              {isAr ? 'مباشر' : 'Live'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => {
          const card = (
            <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 cursor-default">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-2xl -mr-8 -mt-8 opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg} border ${stat.border}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div className={cn("flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
                    stat.trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {stat.trendUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tighter">{stat.value.toLocaleString('en-US')}</span>
                  {stat.unit && <span className="text-xs text-muted-foreground font-bold">{stat.unit}</span>}
                </div>
              </div>
            </div>
          );

          return stat.href ? (
            <Link key={stat.title} href={stat.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={stat.title}>{card}</div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.revenueTrends} lang={lang} />
        </div>
        <div>
          <StatusPieChart data={stats.statusDistribution} lang={lang} />
        </div>
      </div>

      {/* Bottom Row: Top Products + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TopProducts products={stats.topProducts} lang={lang} />
        </div>

        {/* Quick Access */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-5">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
            {isAr ? 'وصول سريع' : 'Quick Access'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-200"
              >
                <div className={`p-3 rounded-xl ${action.bg} group-hover:scale-110 transition-transform`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-xs font-bold text-center leading-tight">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper (inline since it's a server component)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
