import prisma from '@/lib/prisma';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { ShoppingCart, TrendingUp, Clock, CheckCircle2, XCircle, Truck, Package } from "lucide-react"
import { Locale } from '@/lib/i18n-config';
import { OrderStatusSelect } from '@/components/dashboard/order-status-select';
import { OrderDetailsDialog } from '@/components/dashboard/order-details-dialog';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG: Record<string, { label_en: string; label_ar: string; color: string; icon: React.ElementType }> = {
  pending:    { label_en: 'Pending',    label_ar: 'قيد الانتظار',  color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',   icon: Clock },
  confirmed:  { label_en: 'Confirmed',  label_ar: 'مؤكد',          color: 'bg-sky-500/10 text-sky-600 border-sky-500/20',          icon: CheckCircle2 },
  shipped:    { label_en: 'Shipped',    label_ar: 'تم الشحن',       color: 'bg-violet-500/10 text-violet-600 border-violet-500/20', icon: Truck },
  delivered:  { label_en: 'Delivered',  label_ar: 'تم التسليم',     color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: Package },
  cancelled:  { label_en: 'Cancelled',  label_ar: 'ملغى',           color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',      icon: XCircle },
};

export default async function DashboardOrders({ params: { lang } }: { params: { lang: Locale } }) {
  const orders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' }
  });

  const isAr = lang === 'ar';

  // Quick stats
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const quickStats = [
    { label: isAr ? 'إجمالي الطلبات' : 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: isAr ? 'قيد الانتظار' : 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: isAr ? 'تم التسليم' : 'Delivered', value: deliveredCount, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: isAr ? 'الإيرادات' : 'Revenue', value: `${totalRevenue.toLocaleString('en-US')} DZD`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">{isAr ? 'الطلبات' : 'Orders'}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isAr ? `إجمالي ${orders.length} طلب مسجل` : `${orders.length} orders registered`}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-2xl border bg-card">
            <div className={`p-2.5 rounded-xl ${s.bg} shrink-0`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{s.label}</p>
              <p className="text-xl font-black tracking-tight leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border bg-card overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            {isAr ? 'قائمة الطلبات' : 'Orders List'}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground w-28">{isAr ? 'رقم الطلب' : 'Order'}</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{isAr ? 'العميل' : 'Customer'}</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{isAr ? 'الولاية' : 'Wilaya'}</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{isAr ? 'التاريخ' : 'Date'}</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{isAr ? 'المبلغ' : 'Amount'}</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{isAr ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
                const StatusIcon = statusCfg.icon;
                return (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors group">
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        #{order.id.split('-')[0].toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-sm">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground font-medium">{order.customer_wilaya || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                          day: 'numeric', month: 'short', year: '2-digit'
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-sm">{Number(order.total_amount).toLocaleString('en-US')}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">DZD</span>
                    </TableCell>
                    <TableCell>
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} lang={lang} />
                    </TableCell>
                    <TableCell>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <OrderDetailsDialog orderId={order.id} lang={lang} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <ShoppingCart className="h-10 w-10 opacity-20" />
                    <p className="font-bold">{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders && orders.length > 0 ? (
          orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
            const StatusIcon = statusCfg.icon;
            return (
              <div key={order.id} className="rounded-2xl border bg-card p-4 space-y-3 shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                      #{order.id.split('-')[0].toUpperCase()}
                    </span>
                    <h3 className="font-bold text-base mt-1 leading-tight">{order.customer_name}</h3>
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                    </p>
                    <p className="font-black text-primary text-sm mt-0.5">
                      {Number(order.total_amount).toLocaleString('en-US')} DZD
                    </p>
                  </div>
                </div>

                {order.customer_wilaya && (
                  <div className="text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-xl">
                    📍 {order.customer_wilaya} — {order.customer_address}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} lang={lang} />
                  </div>
                  <OrderDetailsDialog orderId={order.id} lang={lang} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-3xl text-muted-foreground">
            <ShoppingCart className="h-10 w-10 opacity-20" />
            <p className="font-bold text-sm">{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
