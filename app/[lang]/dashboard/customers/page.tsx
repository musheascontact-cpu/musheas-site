import { getCustomers } from '@/actions/customers';
import { Locale } from '@/lib/i18n-config';
import { Users, Mail, Phone, MapPin, ShoppingBag, DollarSign, Search, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { WILAYAS } from '@/lib/algeria-data';

export default async function CustomersPage({ params: { lang } }: { params: { lang: Locale } }) {
  const customers = await getCustomers();
  const isAr = lang === 'ar';

  const getWilayaName = (code: string) => {
    return WILAYAS.find(w => w.code.toString() === code)?.ar_name || code;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-card to-muted/50 border-2 border-blue-500/10 shadow-2xl shadow-blue-500/5">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-[2rem] bg-blue-500 shadow-2xl shadow-blue-500/30 text-white">
            <Users className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {isAr ? 'قاعدة بيانات العملاء' : 'Customer Database'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              {isAr 
                ? `إجمالي ${customers.length} عميل فريد` 
                : `Total of ${customers.length} unique customers`}
            </p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-card rounded-[3rem] border-2 shadow-2xl shadow-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b-2 border-border/50">
              <tr>
                <th className={cn("px-6 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground", isAr ? "text-right" : "text-left")}>
                  {isAr ? 'العميل' : 'Customer'}
                </th>
                <th className={cn("px-6 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground", isAr ? "text-right" : "text-left")}>
                  {isAr ? 'بيانات التواصل' : 'Contact Info'}
                </th>
                <th className={cn("px-6 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground", isAr ? "text-right" : "text-left")}>
                  {isAr ? 'الموقع' : 'Location'}
                </th>
                <th className={cn("px-6 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-center")}>
                  {isAr ? 'الطلبات' : 'Orders'}
                </th>
                <th className={cn("px-6 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground", isAr ? "text-left" : "text-right")}>
                  {isAr ? 'إجمالي الإنفاق' : 'Total Spent'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {customers.length > 0 ? (
                customers.map((customer, idx) => (
                  <tr key={idx} className="group hover:bg-blue-500/[0.02] transition-colors">
                    <td className="px-6 py-6">
                      <div className={cn("flex items-center gap-4", isAr && "flex-row-reverse")}>
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center text-blue-600 font-black text-lg border border-blue-500/10">
                          {customer.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className={isAr ? "text-right" : "text-left"}>
                          <p className="font-black text-base">{customer.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                            {isAr ? 'آخر طلب:' : 'Last order:'} {format(new Date(customer.lastOrder), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1.5">
                        <div className={cn("flex items-center gap-2 text-xs font-bold", isAr && "flex-row-reverse")}>
                          <Mail className="h-3 w-3 text-blue-500" />
                          <span className="opacity-70">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className={cn("flex items-center gap-2 text-xs font-bold", isAr && "flex-row-reverse")}>
                            <Phone className="h-3 w-3 text-green-500" />
                            <span className="opacity-70">{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={cn("flex items-start gap-2", isAr && "flex-row-reverse")}>
                        <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div className={cn("text-xs font-bold", isAr ? "text-right" : "text-left")}>
                          <p className="text-blue-600 font-black">{getWilayaName(customer.wilaya)}</p>
                          <p className="text-muted-foreground opacity-60 truncate max-w-[150px]">{customer.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/10">
                         <ShoppingBag className="h-3 w-3" />
                         <span className="font-black text-xs">{customer.orderCount}</span>
                       </div>
                    </td>
                    <td className={cn("px-6 py-6", isAr ? "text-left" : "text-right")}>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-foreground">{customer.totalSpent.toLocaleString()} <span className="text-[10px] opacity-40">DZD</span></span>
                        <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600", isAr && "justify-end")}>
                          <DollarSign className="h-3 w-3" />
                          {isAr ? 'عميل نشط' : 'Active Client'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto opacity-10 mb-4" />
                    <p className="text-xl font-black">
                      {isAr ? 'لا يوجد عملاء مسجلين بعد' : 'No customers found yet'}
                    </p>
                    <p className="text-sm opacity-60 mt-2">
                      {isAr ? 'ستظهر بيانات العملاء هنا بمجرد استلام أول طلب' : 'Customer data will appear here once orders are placed'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
