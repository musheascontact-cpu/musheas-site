import prisma from '@/lib/prisma';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { ShoppingCart } from "lucide-react"
import { Locale } from '@/lib/i18n-config';
import { OrderStatusSelect } from '@/components/dashboard/order-status-select';
import { OrderDetailsDialog } from '@/components/dashboard/order-details-dialog';

export default async function DashboardOrders({ params: { lang } }: { params: { lang: Locale } }) {
  const orders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' }
  });

  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isAr ? '🛒 الطلبات' : '🛒 Orders'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isAr
            ? `إجمالي ${orders?.length ?? 0} طلب مسجل`
            : `Total of ${orders?.length ?? 0} registered orders`}
        </p>
      </div>

      {/* Table */}
      {/* Desktop Table - Hidden on Mobile */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{isAr ? 'رقم الطلب' : 'Order ID'}</TableHead>
              <TableHead>{isAr ? 'العميل' : 'Customer'}</TableHead>
              <TableHead>{isAr ? 'العنوان' : 'Address'}</TableHead>
              <TableHead>{isAr ? 'التاريخ' : 'Date'}</TableHead>
              <TableHead>{isAr ? 'المبلغ' : 'Amount'}</TableHead>
              <TableHead>{isAr ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="text-right">{isAr ? 'إجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                return (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{order.id.split('-')[0].toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                      {order.customer_address}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-semibold">{Number(order.total_amount).toLocaleString('en-US')} DZD</TableCell>

                    <TableCell>
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                        lang={lang}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderDetailsDialog orderId={order.id} lang={lang} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8 opacity-30" />
                    <p>{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List - Hidden on Desktop */}
      <div className="flex flex-col gap-4 md:hidden">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    #{order.id.split('-')[0].toUpperCase()}
                  </p>
                  <h3 className="font-bold text-lg leading-tight">{order.customer_name}</h3>
                  <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                      day: 'numeric', month: 'short'
                    })}
                  </p>
                  <p className="font-bold text-primary mt-1">
                    {Number(order.total_amount).toLocaleString('en-US')} DZD
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                <span className="font-semibold block mb-1 text-[10px] uppercase tracking-wider">{isAr ? 'العنوان' : 'Address'}:</span>
                <p className="line-clamp-2">{order.customer_address}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1">
                   <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                      lang={lang}
                    />
                </div>
                <OrderDetailsDialog orderId={order.id} lang={lang} />
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-3xl opacity-50">
             <ShoppingCart className="h-12 w-12" />
             <p className="font-bold">{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
