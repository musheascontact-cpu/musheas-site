'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createSwiftExpressShipment } from '@/actions/orders';
import { useToast } from '@/components/ui/use-toast';

interface SwiftShipmentButtonProps {
  orderId: string;
  lang: string;
  currentTrackingId?: string;
  onSuccess?: (trackingId: string) => void;
}

export function SwiftShipmentButton({ orderId, lang, currentTrackingId, onSuccess }: SwiftShipmentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [successTrackingId, setSuccessTrackingId] = useState<string | null>(null);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  async function handleCreateShipment() {
    setLoading(true);
    try {
      const result = await createSwiftExpressShipment(orderId);
      if (result.success) {
        setSuccessTrackingId(result.tracking);
        onSuccess?.(result.tracking);
        toast({
          title: isAr ? 'تم إنشاء الشحنة' : 'Shipment Created',
          description: isAr 
            ? `تم ربط الطلب بـ Swift Express بنجاح. رقم التتبع: ${result.tracking}`
            : `Order linked to Swift Express successfully. Tracking ID: ${result.tracking}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: isAr ? 'خطأ في الربط' : 'Integration Error',
          description: result.error,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isAr ? 'خطأ غير متوقع' : 'Unexpected Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const trackingToShow = currentTrackingId || successTrackingId;

  if (trackingToShow) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-3xl bg-green-500/10 border border-green-500/20 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="p-2 rounded-2xl bg-green-500 text-white">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-green-700 uppercase font-black tracking-widest">
            {isAr ? 'تم الإرسال بنجاح' : 'SENT SUCCESSFULLY'}
          </p>
          <p className="font-mono font-bold text-green-800 break-all">
            {trackingToShow}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleCreateShipment}
      disabled={loading}
      className="w-full h-14 rounded-3xl font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-[0.98]"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {isAr ? 'جاري المعالجة...' : 'Processing...'}
        </>
      ) : (
        <>
          <Truck className="mr-2 h-5 w-5" />
          {isAr ? 'إرسال إلى Swift Express' : 'Send to Swift Express'}
        </>
      )}
    </Button>
  );
}
