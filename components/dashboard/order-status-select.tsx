'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrderStatus } from '@/actions/orders';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const statusConfig: Record<string, { label_ar: string; label_en: string; className: string }> = {
  pending:    { label_ar: 'قيد الانتظار', label_en: 'Pending',    className: 'text-yellow-600' },
  processing: { label_ar: 'قيد المعالجة', label_en: 'Processing', className: 'text-blue-600' },
  shipped:    { label_ar: 'تم الشحن',      label_en: 'Shipped',    className: 'text-purple-600' },
  delivered:  { label_ar: 'تم التسليم',    label_en: 'Delivered',  className: 'text-green-600' },
  cancelled:  { label_ar: 'ملغي',           label_en: 'Cancelled',  className: 'text-red-600' },
};

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  lang: string;
}

export function OrderStatusSelect({ orderId, currentStatus, lang }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true);
    const result = await updateOrderStatus(orderId, newStatus);
    setIsUpdating(false);

    if (result.success) {
      setStatus(newStatus);
      toast({
        title: isAr ? 'تم التحديث' : 'Updated',
        description: isAr ? 'تم تحديث حالة الطلب بنجاح' : 'Order status updated successfully',
      });
    } else {
      toast({
        variant: 'destructive',
        title: isAr ? 'خطأ' : 'Error',
        description: result.error,
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className={`h-8 w-[130px] text-xs font-medium ${statusConfig[status]?.className || ''}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusConfig).map(([key, config]) => (
            <SelectItem key={key} value={key} className="text-xs">
              {isAr ? config.label_ar : config.label_en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
