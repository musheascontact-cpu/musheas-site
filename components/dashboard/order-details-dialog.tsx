'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Loader2, 
  Package, 
  User, 
  Mail, 
  MapPin, 
  Clock,
  Phone,
  Truck,
  Building2,
  Home,
  CheckCircle2,
  CreditCard,
  Edit2,
  Printer
} from 'lucide-react';
import { getOrderDetails } from '@/actions/orders';
import { updateShippingFee, updateDeliveryType } from '@/actions/shipping';
import { Badge } from '@/components/ui/badge';
import { OrderInvoice } from './order-invoice';
import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SwiftShipmentButton } from './swift-shipment-button';
import { WILAYAS } from '@/lib/algeria-data';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderDetailsDialogProps {
  orderId: string;
  lang: string;
}

export function OrderDetailsDialog({ orderId, lang }: OrderDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingType, setIsUpdatingType] = useState(false);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  
  const isAr = lang === 'ar';

  async function handleOpen() {
    setIsLoading(true);
    setOpen(true);
    const data = await getOrderDetails(orderId);
    setOrder(data);
    setShippingFee(Number(data?.shipping_fee) || 0);
    setIsLoading(false);
  }

  async function handleUpdateShipping() {
    setIsUpdating(true);
    const result = await updateShippingFee(orderId, shippingFee);
    if (result.success) {
      setOrder({ ...order, shipping_fee: shippingFee });
      toast({
        title: isAr ? 'تم التحديث' : 'Updated',
        description: isAr ? 'تم تحديث سعر التوصيل بنجاح.' : 'Shipping fee updated successfully.',
      });
    }
    setIsUpdating(false);
  }

  async function handleUpdateType(value: string) {
    setIsUpdatingType(true);
    const result = await updateDeliveryType(orderId, value);
    if (result.success) {
      setOrder({ ...order, delivery_type: value });
      toast({
        title: isAr ? 'تم تحديث النوع' : 'Type Updated',
        description: isAr ? 'تم تغيير نوع التوصيل بنجاح.' : 'Delivery type updated successfully.',
      });
    }
    setIsUpdatingType(false);
  }

  const getWilayaName = (code: string) => {
    return WILAYAS.find(w => w.code.toString() === code)?.ar_name || code;
  };

  const productsSubtotal = order?.order_items?.reduce((acc: number, item: any) => acc + (item.price_at_time * item.quantity), 0) || 0;
  const finalTotal = productsSubtotal + (Number(shippingFee) || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpen}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            {isAr ? 'تفاصيل الطلب' : 'Order Details'} - #{orderId.split('-')[0].toUpperCase()}
          </DialogTitle>
          <DialogDescription>
            {isAr ? 'عرض بيانات العميل والمنتجات المطلوبة.' : 'View customer details and ordered products.'}
          </DialogDescription>
          {order && (
            <div className="absolute top-6 right-12 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="rounded-full px-4 h-9 font-black uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
              >
                <Printer className="mr-2 h-4 w-4" />
                {isAr ? 'طباعة الوصل' : 'Print Receipt'}
              </Button>
            </div>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </div>
        ) : order ? (
          <div className="space-y-8 py-4">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between p-4 rounded-3xl bg-muted/30 border border-border/50 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                    {isAr ? 'حالة الطلب' : 'ORDER STATUS'}
                  </p>
                  <Badge className="mt-0.5 font-black uppercase text-[10px] tracking-widest px-3 py-0">
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                  {isAr ? 'تاريخ الطلب' : 'ORDER DATE'}
                </p>
                <p className="font-bold mt-0.5">
                  {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest px-2">
                  <User className="h-4 w-4" />
                  <h3>{isAr ? 'بيانات العميل' : 'Customer Info'}</h3>
                </div>
                <div className="p-5 rounded-[2rem] border bg-card/50 space-y-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-xl bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">{isAr ? 'الاسم بالكامل' : 'Full Name'}</p>
                      <p className="font-black text-lg">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-xl bg-primary/20 text-primary">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{isAr ? 'رقم الهاتف' : 'Phone Number'}</p>
                        <p className="font-black text-lg tracking-tighter">
                          {order.customer_phone || (isAr ? 'غير متوفر' : 'Not Provided')}
                        </p>
                      </div>
                    </div>
                    {order.customer_phone && (
                      <Button size="sm" asChild className="rounded-full px-4 h-9 shadow-lg shadow-primary/20">
                        <a href={`tel:${order.customer_phone}`}>
                          <Phone className="mr-2 h-3.5 w-3.5" />
                          {isAr ? 'اتصال' : 'Call'}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest px-2">
                  <Truck className="h-4 w-4" />
                  <h3>{isAr ? 'معلومات التوصيل' : 'Delivery Details'}</h3>
                </div>
                <div className="p-5 rounded-[2rem] border bg-card/50 space-y-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center justify-between bg-muted/40 p-3 rounded-2xl border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${order.delivery_type === 'home' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'}`}>
                        {order.delivery_type === 'home' ? <Home className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{isAr ? 'نوع التوصيل' : 'Delivery Type'}</p>
                        <p className="font-black">
                          {order.delivery_type === 'home' 
                            ? (isAr ? 'توصيل للمنزل' : 'Home Delivery') 
                            : (isAr ? 'توصيل للمكتب' : 'Office Pickup')}
                        </p>
                      </div>
                    </div>
                    <Select 
                      onValueChange={handleUpdateType} 
                      defaultValue={order.delivery_type}
                      disabled={isUpdatingType}
                    >
                      <SelectTrigger className="w-[100px] h-8 rounded-full text-[10px] font-black uppercase tracking-widest bg-background border-2 shadow-sm">
                        <SelectValue placeholder={isAr ? 'تعديل' : 'Edit'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home" className="text-xs font-bold">{isAr ? 'للمنزل' : 'Home'}</SelectItem>
                        <SelectItem value="office" className="text-xs font-bold">{isAr ? 'للمكتب' : 'Office'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-xl bg-muted text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">{isAr ? 'الولاية والعنوان' : 'Wilaya & Address'}</p>
                      <p className="font-bold text-primary">{getWilayaName(order.customer_wilaya)}</p>
                      <p className="text-sm font-medium leading-relaxed mt-1 text-muted-foreground">{order.customer_address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Fee Editor */}
            <div className="p-6 rounded-[2rem] bg-primary/5 border-2 border-primary/20 shadow-xl shadow-primary/5">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" />
                    {isAr ? 'سعر التوصيل' : 'Shipping Fee'}
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(Number(e.target.value))}
                      className="h-12 pl-4 pr-12 text-lg font-black rounded-2xl border-2 focus-visible:ring-primary shadow-inner"
                      placeholder="0"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground pointer-events-none">
                      DZD
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleUpdateShipping} 
                  disabled={isUpdating}
                  className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : (isAr ? 'حفظ السعر' : 'Save Fee')}
                </Button>
              </div>
            </div>

            {/* Swift Express Integration */}
            <SwiftShipmentButton 
              orderId={orderId} 
              lang={lang} 
              currentTrackingId={order.tracking_id}
              onSuccess={(tid) => setOrder({ ...order, tracking_id: tid })}
            />

            {/* Shipping Fee Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                  <Package className="h-4 w-4" />
                  <h3>{isAr ? 'المنتجات المطلوبة' : 'Order Summary'}</h3>
                </div>
                <Badge variant="secondary" className="rounded-full font-black text-[10px]">
                  {order.order_items?.length} {isAr ? 'منتجات' : 'Items'}
                </Badge>
              </div>
              
              <div className="rounded-[2.5rem] border bg-card/50 overflow-hidden shadow-xl backdrop-blur-sm">
                <div className="divide-y divide-border/50">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-primary/5 transition-all duration-300">
                      <div className="flex items-center gap-5">
                        <div className="relative h-16 w-16 rounded-[1.25rem] overflow-hidden border-2 border-background shadow-md">
                          <img
                            src={item.product?.image_url}
                            className="object-cover w-full h-full"
                            alt=""
                          />
                        </div>
                        <div>
                          <p className="font-black text-lg">
                            {item.product?.name?.[isAr ? 'ar' : 'en'] ?? item.product?.name?.en}
                          </p>
                          <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                            {item.quantity} × <span className="text-primary font-black">{item.price_at_time?.toLocaleString('en-US')} DZD</span>

                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-foreground">
                          {(item.quantity * item.price_at_time)?.toLocaleString('en-US')} <span className="text-[10px] text-muted-foreground">DZD</span>

                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Section */}
                <div className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-t-2 border-primary/20">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-muted-foreground">
                      <span>{isAr ? 'مجموع المنتجات' : 'Products Subtotal'}</span>
                      <span className="font-mono">{productsSubtotal.toLocaleString('en-US')} DZD</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-primary">
                      <span>{isAr ? 'سعر التوصيل' : 'Shipping Fee'}</span>
                      <span className="font-mono">+ {Number(shippingFee).toLocaleString('en-US')} DZD</span>

                    </div>
                    <div className="pt-4 mt-4 border-t border-primary/20 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{isAr ? 'إجمالي المبلغ المستحق' : 'TOTAL AMOUNT DUE'}</p>
                        <p className="text-sm font-bold text-green-600 mt-1 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          {isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-primary drop-shadow-sm">
                          {finalTotal.toLocaleString('en-US')}

                        </span>
                        <span className="text-sm font-black text-primary opacity-60">DZD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-10 text-muted-foreground">
            {isAr ? 'فشل في تحميل البيانات.' : 'Failed to load data.'}
          </p>
        )}
        {/* Invoice for Printing (Self-handles hidden/print via Tailwind) */}
        {open && order && (
          <OrderInvoice order={order} lang={lang} ref={printRef} />
        )}
      </DialogContent>
    </Dialog>
  );
}
