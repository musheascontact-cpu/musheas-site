'use client';

import { forwardRef } from 'react';
import { WILAYAS } from '@/lib/algeria-data';
import { cn, formatPrice } from '@/lib/utils';

interface OrderInvoiceProps {
  order: any;
  lang: string;
}

export const OrderInvoice = forwardRef<HTMLDivElement, OrderInvoiceProps>(({ order, lang }, ref) => {
  if (!order) return null;

  const isAr = lang === 'ar';
  const productsSubtotal = order.order_items?.reduce((acc: number, item: any) => acc + (item.price_at_time * item.quantity), 0) || 0;
  const shipping = Number(order.shipping_fee) || 0;
  const total = productsSubtotal + shipping;

  const getWilayaName = (code: string) => {
    return WILAYAS.find(w => w.code.toString() === code)?.ar_name || code;
  };

  return (
    <div 
      ref={ref} 
      id="print-root"
      className={cn(
        "p-8 bg-white text-black w-[21cm] mx-auto hidden print:block print:p-0",
        isAr ? "font-serif" : "font-sans"
      )}
      dir={isAr ? "rtl" : "ltr"}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 1cm; }
          body { background: white !important; }
          #print-root { display: block !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
        }
      `}} />
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xl">M</span>
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-black">MUSHEAS</h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Mycology & Biotechnology</p>
          <div className="mt-6 text-[10px] font-bold space-y-1 opacity-60 uppercase tracking-widest">
            <p>Algiers, Algeria</p>
            <p>contact@musheas.com</p>
            <p>www.musheas.com</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-black uppercase mb-4 opacity-10">{isAr ? 'وصل طلب' : 'INVOICE'}</h2>
          <div className="text-[10px] font-bold space-y-2 uppercase tracking-widest">
            <p><span className="opacity-40">{isAr ? 'رقم الطلب' : 'ORDER NO'}:</span> <span className="text-lg font-black opacity-100 ml-2">#{order.id.split('-')[0].toUpperCase()}</span></p>
            <p><span className="opacity-40">{isAr ? 'التاريخ' : 'DATE'}:</span> <span className="opacity-100 ml-2">{new Date(order.created_at).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span></p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-20 mb-16">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 border-b-2 border-black pb-2">
            {isAr ? 'العميل' : 'RECIPIENT'}
          </h3>
          <div className="text-2xl font-black mb-1">{order.customer_name}</div>
          <div className="text-lg font-black text-black/60 mb-4">{order.customer_phone}</div>
          <div className="text-xs font-bold uppercase tracking-widest leading-relaxed">
            <p className="text-black mb-1">{getWilayaName(order.customer_wilaya)}</p>
            <p className="opacity-60">{order.customer_address}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6 border-b-2 border-black pb-2">
            {isAr ? 'تفاصيل التوصيل' : 'SHIPPING DETAILS'}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{isAr ? 'النوع' : 'TYPE'}</span>
              <span className="text-xs font-black px-3 py-1 bg-black text-white rounded-full uppercase tracking-widest">
                {order.delivery_type === 'home' 
                  ? (isAr ? 'للمنزل' : 'HOME') 
                  : (isAr ? 'للمكتب' : 'OFFICE')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{isAr ? 'الدفع' : 'PAYMENT'}</span>
              <span className="text-xs font-black uppercase tracking-widest">{isAr ? 'عند الاستلام' : 'COD'}</span>
            </div>
            {order.tracking_id && (
              <div className="flex justify-between items-center pt-2 border-t border-black/5">
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{isAr ? 'رقم التتبع' : 'TRACKING'}</span>
                <span className="text-xs font-mono font-black">{order.tracking_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-16">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-4 border-black">
              <th className="py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{isAr ? 'المنتج' : 'DESCRIPTION'}</th>
              <th className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{isAr ? 'الكمية' : 'QTY'}</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{isAr ? 'السعر' : 'UNIT PRICE'}</th>
              <th className="py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{isAr ? 'المجموع' : 'AMOUNT'}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black/5">
            {order.order_items?.map((item: any) => (
              <tr key={item.id}>
                <td className="py-6">
                  <div className="text-lg font-black">{item.product?.name?.[isAr ? 'ar' : 'en'] ?? item.product?.name?.en}</div>
                  <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">SKU: {item.product_id.split('-')[0].toUpperCase()}</div>
                </td>
                <td className="py-6 text-center text-lg font-black">{item.quantity}</td>
                <td className="py-6 text-right text-lg font-bold">{formatPrice(item.price_at_time, lang)}</td>
                <td className="py-6 text-right text-lg font-black">{formatPrice(item.quantity * item.price_at_time, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end pt-8 border-t-2 border-black/5">
        <div className="w-80 space-y-4">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            <span className="opacity-40">{isAr ? 'المجموع الفرعي' : 'SUBTOTAL'}</span>
            <span className="text-lg font-bold">{formatPrice(productsSubtotal, lang)} DZD</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
            <span className="opacity-40">{isAr ? 'مصاريف التوصيل' : 'SHIPPING'}</span>
            <span className="text-lg font-bold text-black/60">+ {formatPrice(shipping, lang)} DZD</span>
          </div>
          <div className="pt-6 border-t-4 border-black flex justify-between items-center">
            <span className="text-xs font-black uppercase tracking-[0.3em]">{isAr ? 'الإجمالي النهائي' : 'GRAND TOTAL'}</span>
            <div className="text-right">
              <p className="text-4xl font-black leading-none">{formatPrice(total, lang)} <span className="text-xs font-bold opacity-40">DZD</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-24 pt-12 border-t border-black/10 text-center">
        <p className="text-lg font-black uppercase tracking-[0.3em] mb-2">{isAr ? 'شكراً لثقتكم' : 'THANK YOU'}</p>
        <p className="text-xs opacity-60 font-bold italic">
          {isAr ? 'تم إنشاء هذا الوصل تلقائياً من نظام MUSHEAS' : 'This receipt was automatically generated by MUSHEAS system'}
        </p>
      </div>
    </div>
  );
});

OrderInvoice.displayName = 'OrderInvoice';
