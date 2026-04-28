'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
// Using fetch API directly - no server action needed
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
  lang: string;
  onSuccess?: () => void;
}

export function DeleteProductButton({ productId, productName, lang, onSuccess }: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: isAr ? 'تم الحذف' : 'Deleted',
          description: isAr ? `تم حذف المنتج "${productName}"` : `Product "${productName}" deleted`,
        });
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast({
          variant: 'destructive',
          title: isAr ? 'خطأ في الحذف' : 'Deletion Error',
          description: result.error?.includes('violates foreign key constraint')
            ? (isAr ? 'لا يمكن حذف هذا المنتج لوجود طلبات شراء مرتبطة به.' : 'Cannot delete: product has associated orders.')
            : result.error,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isAr ? 'خطأ في الاتصال' : 'Connection Error',
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isAr ? 'هل أنت متأكد؟' : 'Are you sure?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isAr 
              ? `سيتم حذف المنتج "${productName}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.`
              : `This will permanently delete the product "${productName}". This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{isAr ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAr ? 'حذف' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
