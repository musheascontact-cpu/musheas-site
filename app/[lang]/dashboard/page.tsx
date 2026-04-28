import { getDashboardStats } from '@/actions/analytics';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, Users, LayoutDashboard, Calendar, Activity } from "lucide-react"
import { Locale } from '@/lib/i18n-config';
import { RevenueChart, StatusPieChart } from '@/components/dashboard/analytics-charts';
import { TopProducts } from '@/components/dashboard/top-products';
import { RealtimeDashboardSync } from '@/components/dashboard/realtime-sync';

export default async function DashboardOverview({ params: { lang } }: { params: { lang: Locale } }) {
  const stats = await getDashboardStats();
  const isAr = lang === 'ar';

  if (!stats) return <div>{isAr ? 'خطأ في تحميل البيانات' : 'Error loading stats'}</div>;

  const summaryStats = [
    {
      title: isAr ? 'إجمالي المبيعات' : 'Total Revenue',
      value: `${stats.counts.revenue.toLocaleString()} DZD`,
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: isAr ? 'الطلبات' : 'Total Orders',
      value: stats.counts.orders,
      icon: ShoppingCart,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: isAr ? 'المنتجات' : 'Products',
      value: stats.counts.products,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: isAr ? 'المشتركين' : 'Subscribers',
      value: stats.counts.subscribers,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      <RealtimeDashboardSync />
      
      {/* Page Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[3rem] bg-gradient-to-br from-card via-card/80 to-primary/5 border border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-[2rem] bg-primary shadow-2xl shadow-primary/30 text-primary-foreground">
            <LayoutDashboard className="h-10 w-10" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-black tracking-tight text-foreground">
                {isAr ? 'لوحة الإحصائيات' : 'Analytics Center'}
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {isAr ? 'تزامن مباشر' : 'Live Sync'}
              </span>
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4 opacity-70" />
              {new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-xl shadow-black/5 hover:-translate-y-1">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <RevenueChart data={stats.revenueTrends} lang={lang} />
        </div>
        <div>
           <StatusPieChart data={stats.statusDistribution} lang={lang} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-1">
            <TopProducts products={stats.topProducts} lang={lang} />
         </div>
         <div className="lg:col-span-2">
            <Card className="rounded-[2.5rem] border-2 shadow-xl shadow-black/5 h-full overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-black uppercase tracking-widest opacity-60">
                    {isAr ? 'نظرة سريعة على المخزون' : 'Stock Overview'}
                  </CardTitle>
                  <Package className="h-5 w-5 text-blue-500" />
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-center h-48 opacity-20 italic font-medium">
                     {isAr ? 'سيتم ربط بيانات المخزون قريباً...' : 'Inventory insights coming soon...'}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
