'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/actions/orders';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  XCircle, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<string, { 
  label_ar: string; 
  label_en: string; 
  color: string;
  bgColor: string;
  icon: any;
  next?: string;
}> = {
  pending: { 
    label_ar: 'قيد الانتظار', 
    label_en: 'Pending',    
    color: 'text-amber-600', 
    bgColor: 'bg-amber-100',
    icon: Clock,
    next: 'processing'
  },
  processing: { 
    label_ar: 'قيد المعالجة', 
    label_en: 'Processing', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    icon: Package,
    next: 'shipped'
  },
  shipped: { 
    label_ar: 'تم الشحن',      
    label_en: 'Shipped',    
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100',
    icon: Truck,
    next: 'delivered'
  },
  delivered: { 
    label_ar: 'تم التسليم',    
    label_en: 'Delivered',  
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-100',
    icon: CheckCircle2 
  },
  cancelled: { 
    label_ar: 'ملغي',           
    label_en: 'Cancelled',  
    color: 'text-rose-600', 
    bgColor: 'bg-rose-100',
    icon: XCircle 
  },
};

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  lang: string;
  onStatusChange?: (newStatus: string) => void;
}

export function OrderStatusSelect({ orderId, currentStatus, lang, onStatusChange }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const config = statusConfig[status] || statusConfig.pending;
  const nextStatus = config.next;
  const nextConfig = nextStatus ? statusConfig[nextStatus] : null;

  async function handleStatusChange(newStatus: string) {
    if (newStatus === status) return;
    
    setIsUpdating(true);
    const result = await updateOrderStatus(orderId, newStatus);
    setIsUpdating(false);

    if (result.success) {
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
      toast({
        title: isAr ? 'تم تحديث المرحلة' : 'Stage Updated',
        description: isAr 
          ? `انتقل الطلب إلى: ${statusConfig[newStatus]?.label_ar}` 
          : `Order moved to: ${statusConfig[newStatus]?.label_en}`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: isAr ? 'خطأ في التحديث' : 'Update Failed',
        description: result.error,
      });
    }
  }

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={isUpdating}
            className={`h-9 px-3 border-none shadow-sm transition-all duration-300 ${config.bgColor} ${config.color} hover:${config.bgColor} hover:brightness-95 rounded-full flex items-center gap-2 group`}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            <span className="text-xs font-bold">
              {isAr ? config.label_ar : config.label_en}
            </span>
            <MoreHorizontal className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align={isAr ? 'end' : 'start'} className="w-56 p-2 rounded-xl">
          {nextConfig && (
            <>
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1.5">
                {isAr ? 'المرحلة التالية' : 'Next Stage'}
              </DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleStatusChange(nextStatus!)}
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-primary/5 rounded-lg group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${nextConfig.bgColor} ${nextConfig.color}`}>
                    <nextConfig.icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm">
                    {isAr ? nextConfig.label_ar : nextConfig.label_en}
                  </span>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
            </>
          )}

          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1.5">
            {isAr ? 'تغيير الحالة إلى' : 'Change Status To'}
          </DropdownMenuLabel>
          
          {Object.entries(statusConfig)
            .filter(([key]) => key !== status && key !== nextStatus)
            .map(([key, itemConfig]) => (
              <DropdownMenuItem 
                key={key} 
                onClick={() => handleStatusChange(key)}
                className="flex items-center gap-3 p-2 cursor-pointer rounded-lg mb-1 last:mb-0"
              >
                <itemConfig.icon className={`h-4 w-4 ${itemConfig.color}`} />
                <span className="text-sm">
                  {isAr ? itemConfig.label_ar : itemConfig.label_en}
                </span>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
