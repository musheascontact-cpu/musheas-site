'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { upsertPromotion } from '@/actions/promotions';
import type { Promotion } from '@/actions/promotions';

const promotionSchema = z.object({
  id: z.string().optional(),
  title_en: z.string().min(3, 'English title required'),
  title_ar: z.string().min(3, 'Arabic title required'),
  discount_percentage: z.string().refine(v => !isNaN(Number(v)) && Number(v) > 0 && Number(v) <= 100, 'Must be 1-100'),
  end_date: z.string().min(1, 'End date required'),
  is_active: z.boolean().default(true),
  apply_to: z.enum(['all', 'category', 'product']),
  category: z.string().optional(),
  product_id: z.string().optional(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionDialogProps {
  promotion?: Promotion;
  lang: string;
}

export function PromotionDialog({ promotion, lang }: PromotionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  // Format date for datetime-local input
  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 16);
  };

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema) as any,
    defaultValues: promotion ? {
      id: promotion.id,
      title_en: promotion.title_en,
      title_ar: promotion.title_ar,
      discount_percentage: promotion.discount_percentage.toString(),
      end_date: formatDateForInput(promotion.end_date),
      is_active: promotion.is_active,
      apply_to: promotion.apply_to,
      category: promotion.category || '',
      product_id: promotion.product_id || '',
    } : {
      title_en: '',
      title_ar: '',
      discount_percentage: '20',
      end_date: '',
      is_active: true,
      apply_to: 'all',
      category: '',
      product_id: '',
    },
  });

  const applyTo = form.watch('apply_to');
  const discount = form.watch('discount_percentage');

  // Automatically update titles based on discount percentage for new promotions
  useEffect(() => {
    if (!promotion && discount) {
      form.setValue('title_en', `Limited Time Offer: ${discount}% OFF!`);
      form.setValue('title_ar', `عرض محدود: خصم ${discount}%!`);
    }
  }, [discount, form, promotion]);

  async function onSubmit(data: PromotionFormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await upsertPromotion(formData);
      if (result.success) {
        toast({ title: isAr ? 'تم الحفظ ✓' : 'Saved ✓', description: isAr ? 'تم حفظ العرض بنجاح' : 'Promotion saved successfully' });
        setOpen(false);
        if (!promotion) form.reset();
      } else {
        toast({ variant: 'destructive', title: isAr ? 'خطأ' : 'Error', description: result.error });
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {promotion ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="rounded-xl gap-2">
            <Plus className="h-4 w-4" />
            {isAr ? 'إضافة عرض' : 'Add Promotion'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{promotion ? (isAr ? 'تعديل العرض' : 'Edit Promotion') : (isAr ? 'إضافة عرض جديد' : 'New Promotion')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
            
            <FormField control={form.control} name="title_en" render={({ field }) => (
              <FormItem>
                <FormLabel>Title (English)</FormLabel>
                <FormControl><Input placeholder="Limited Time Offer: 20% OFF!" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="title_ar" render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان (عربي)</FormLabel>
                <FormControl><Input dir="rtl" placeholder="عرض محدود: خصم 20%!" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="discount_percentage" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isAr ? 'نسبة الخصم %' : 'Discount %'}</FormLabel>
                  <FormControl><Input type="number" min="1" max="100" placeholder="20" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="end_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isAr ? 'تاريخ الانتهاء' : 'End Date'}</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="apply_to" render={({ field }) => (
              <FormItem>
                <FormLabel>{isAr ? 'يُطبَّق على' : 'Apply To'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">{isAr ? 'جميع المنتجات' : 'All Products'}</SelectItem>
                    <SelectItem value="category">{isAr ? 'فئة معينة' : 'Specific Category'}</SelectItem>
                    <SelectItem value="product">{isAr ? 'منتج محدد' : 'Specific Product'}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            {applyTo === 'category' && (
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isAr ? 'الفئة' : 'Category'}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder={isAr ? 'اختر الفئة' : 'Select category'} /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['Extracts', 'Cultivation', 'Skincare', 'Supplements', 'Research'].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {applyTo === 'product' && (
              <FormField control={form.control} name="product_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isAr ? 'معرّف المنتج' : 'Product ID'}</FormLabel>
                  <FormControl><Input placeholder="prod_xxxxx" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <FormLabel className="text-base">{isAr ? 'نشط' : 'Active'}</FormLabel>
                  <p className="text-sm text-muted-foreground">{isAr ? 'تفعيل العرض وعرضه للمستخدمين' : 'Enable this promotion for users'}</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {promotion ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة العرض' : 'Add Promotion')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
