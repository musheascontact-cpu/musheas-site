'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { togglePromotion, deletePromotion } from '@/actions/promotions';
import { PromotionDialog } from '@/components/dashboard/promotion-dialog';
import type { Promotion } from '@/actions/promotions';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';

export function PromotionActions({ promo, lang }: { promo: Promotion; lang: string }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const isAr = lang === 'ar';

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await togglePromotion(promo.id, checked);
      if (!result.success) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      } else {
        toast({ title: checked ? (isAr ? 'تم تفعيل العرض' : 'Promotion enabled') : (isAr ? 'تم إيقاف العرض' : 'Promotion disabled') });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePromotion(promo.id);
      if (!result.success) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      } else {
        toast({ title: isAr ? 'تم الحذف' : 'Deleted', description: isAr ? 'تم حذف العرض' : 'Promotion deleted' });
      }
    });
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      
      <Switch
        checked={promo.is_active}
        onCheckedChange={handleToggle}
        disabled={isPending}
        aria-label="Toggle promotion"
      />

      <PromotionDialog promotion={promo} lang={lang} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isAr ? 'تأكيد الحذف' : 'Confirm Delete'}</AlertDialogTitle>
            <AlertDialogDescription>
              {isAr ? 'هل أنت متأكد من حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this promotion? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isAr ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {isAr ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
