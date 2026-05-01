'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Loader2, 
  Sparkles, 
  Info, 
  Languages, 
  DollarSign, 
  Image as ImageIcon, 
  CheckCircle2,
  FlaskConical,
  Zap,
  Hand
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { Badge } from '@/components/ui/badge';
import { productSchema, type ProductFormValues, type ProductFormInput } from '@/lib/validations/product';
import { upsertProduct } from '@/actions/products';

interface ProductDialogProps {
  product?: any;
  lang: string;
}

export function ProductDialog({ product, lang }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const defaultValues: Partial<ProductFormInput> = product
    ? {
        id: product.id,
        name_en: product.name?.en || '',
        name_ar: product.name?.ar || '',
        slug: product.slug || '',
        description_en: product.description?.en || '',
        description_ar: product.description?.ar || '',
        price: product.price?.toString() || '',
        sale_price: product.sale_price?.toString() || '',
        image_url: product.image_url || '',
        image_hint: product.image_hint || '',
        category: product.category || '',
        type: product.type || 'b2b',
        ingredients_en: product.ingredients?.en?.join(', ') || '',
        ingredients_ar: product.ingredients?.ar?.join(', ') || '',
        application_en: product.application?.en || '',
        application_ar: product.application?.ar || '',
        benefits_en: product.benefits?.en?.join(', ') || '',
        benefits_ar: product.benefits?.ar?.join(', ') || '',
        is_featured: product.is_featured || false,
        is_visible: product.is_visible !== undefined ? product.is_visible : true,
      }
    : {
        name_en: '',
        name_ar: '',
        slug: '',
        description_en: '',
        description_ar: '',
        price: '',
        sale_price: '',
        image_url: '',
        image_hint: '',
        category: '',
        type: 'b2b',
        ingredients_en: '',
        ingredients_ar: '',
        application_en: '',
        application_ar: '',
        benefits_en: '',
        benefits_ar: '',
        is_featured: false,
        is_visible: true,
      };

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues as any,
  });

  const nameEn = form.watch('name_en');
  const isSlugDirty = form.getFieldState('slug').isDirty;

  // Intelligent Auto-Slug Logic
  useEffect(() => {
    if (!isSlugDirty && nameEn && !product) {
      const suggestedSlug = nameEn
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', suggestedSlug, { shouldValidate: true });
    }
  }, [nameEn, isSlugDirty, form, product]);

  async function onSubmit(data: ProductFormInput) {
    try {
      setIsSubmitting(true);
      const result = await upsertProduct(data);

      if (result.success) {
        setOpen(false);
        if (!product) form.reset();
        toast({
          title: isAr ? 'تم بنجاح ✓' : 'Success ✓',
          description: isAr ? 'تم حفظ المنتج بذكاء' : 'Product saved intelligently',
        });
      } else {
        toast({
          variant: 'destructive',
          title: isAr ? 'خطأ في الحفظ' : 'Save Error',
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
      setIsSubmitting(false);
    }
  }

  const onError = (errors: any) => {
    console.error('Validation Errors:', errors);
    const firstError = Object.values(errors)[0] as any;
    toast({
      variant: 'destructive',
      title: isAr ? 'بيانات غير صالحة' : 'Invalid Data',
      description: firstError?.message || (isAr ? 'يرجى مراجعة الحقول.' : 'Please check the fields.'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" className="gap-2 rounded-2xl px-6 py-6 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold">{isAr ? 'إضافة منتج ذكي' : 'Smart Add Product'}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/10">
        <div className="bg-gradient-to-r from-primary/10 via-background to-primary/5 p-8 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                {product ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">
                  {product
                    ? isAr ? 'تعديل بيانات المنتج' : 'Edit Product Details'
                    : isAr ? 'إنشاء منتج جديد' : 'Create New Product'}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  {isAr ? 'النظام سيقوم بمساعدتك في ملأ البيانات بذكاء.' : 'The system will help you fill details intelligently.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-primary/70 uppercase tracking-widest">
                <Languages className="h-4 w-4" />
                {isAr ? 'المعلومات الأساسية' : 'Basic Information'}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase text-muted-foreground">Name (EN)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Organic Honey" className="h-12 rounded-xl border-2 focus-visible:ring-primary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name_ar"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase text-muted-foreground text-right block">الاسم (عربي)</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" className="h-12 rounded-xl border-2 text-right focus-visible:ring-primary/20" placeholder="مثال: عسل عضوي" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                        Slug
                        {!isSlugDirty && !product && <Badge variant="outline" className="text-[9px] py-0 px-1 bg-primary/5 text-primary border-primary/20 animate-pulse">Auto-Generated</Badge>}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} className="h-12 rounded-xl border-2 pl-4 font-mono text-sm" placeholder="organic-honey" />
                          <div className="absolute right-3 top-3.5 text-muted-foreground">
                            <Info className="h-4 w-4 opacity-50" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase text-muted-foreground">Category</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 rounded-xl border-2" placeholder="Honey, Sweets, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-primary/70 uppercase tracking-widest">
                <DollarSign className="h-4 w-4" />
                {isAr ? 'التسعير والنوع' : 'Pricing & Type'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase text-muted-foreground">Base Price (DZD)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="h-12 rounded-xl border-2" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sale_price"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase text-muted-foreground">Sale Price (DZD)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} type="number" className="h-12 rounded-xl border-2 border-green-100 dark:border-green-900/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-black uppercase text-muted-foreground">Target Market</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-2">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="b2b" className="rounded-lg">B2B (Wholesale)</SelectItem>
                          <SelectItem value="b2c" className="rounded-lg">B2C (Retail)</SelectItem>
                          <SelectItem value="rd" className="rounded-lg">R&D (Testing)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-primary/70 uppercase tracking-widest">
                <ImageIcon className="h-4 w-4" />
                {isAr ? 'الوسائط' : 'Media Content'}
              </div>
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-6 transition-all hover:bg-primary/10">
                        <ImageUpload 
                          value={field.value || ''} 
                          onChange={field.onChange} 
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
 
            {/* Section: Specifications */}
            <div className="space-y-8 bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
              <div className="flex items-center gap-2 text-sm font-bold text-primary/70 uppercase tracking-widest">
                <Info className="h-4 w-4" />
                {isAr ? 'المواصفات التفصيلية' : 'Detailed Specifications'}
              </div>

              <div className="space-y-6">
                {/* Ingredients */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ingredients_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase flex items-center gap-2">
                          <FlaskConical className="h-3 w-3" /> Ingredients (EN)
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} placeholder="e.g. Aqua, Glycerin..." className="min-h-[80px] rounded-xl border-2 resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ingredients_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase text-right flex items-center justify-end gap-2">
                           المكونات (عربي) <FlaskConical className="h-3 w-3" />
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} dir="rtl" className="min-h-[80px] rounded-xl border-2 text-right resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Application */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="application_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase flex items-center gap-2">
                          <Hand className="h-3 w-3" /> Application (EN)
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} placeholder="How to use..." className="min-h-[80px] rounded-xl border-2 resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="application_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase text-right flex items-center justify-end gap-2">
                           طريقة الاستخدام (عربي) <Hand className="h-3 w-3" />
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} dir="rtl" className="min-h-[80px] rounded-xl border-2 text-right resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="benefits_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase flex items-center gap-2">
                          <Zap className="h-3 w-3" /> Benefits (EN)
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} placeholder="Key advantages..." className="min-h-[80px] rounded-xl border-2 resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="benefits_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase text-right flex items-center justify-end gap-2">
                           المميزات (عربي) <Zap className="h-3 w-3" />
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value || ''} dir="rtl" className="min-h-[80px] rounded-xl border-2 text-right resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-6 rounded-[2rem] border border-border/50">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase">Description (EN)</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[120px] rounded-2xl border-2 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase text-right block">الوصف (عربي)</FormLabel>
                      <FormControl>
                        <Textarea {...field} dir="rtl" className="min-h-[120px] rounded-2xl border-2 text-right resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border bg-background/50 hover:bg-background transition-colors">
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between w-full space-y-0">
                        <div className="flex flex-col">
                          <FormLabel className="font-bold cursor-pointer">{isAr ? 'تمييز المنتج' : 'Feature Product'}</FormLabel>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Home Page Spotlight</span>
                        </div>
                        <FormControl>
                          <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-5 w-5 rounded-lg border-2 border-primary/30 text-primary accent-primary" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border bg-background/50 hover:bg-background transition-colors">
                  <FormField
                    control={form.control}
                    name="is_visible"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between w-full space-y-0">
                        <div className="flex flex-col">
                          <FormLabel className="font-bold cursor-pointer">{isAr ? 'ظهور مباشر' : 'Live Visibility'}</FormLabel>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Publish Status</span>
                        </div>
                        <FormControl>
                          <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-5 w-5 rounded-lg border-2 border-primary/30 text-primary accent-primary" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="h-12" />

            <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur-md p-6 -mx-8 -mb-8 border-t z-50">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isAr ? 'جاري الحفظ بذكاء...' : 'Saving intelligently...'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    {product
                      ? isAr ? 'تحديث البيانات' : 'Update Data'
                      : isAr ? 'إنشاء المنتج الآن' : 'Create Product Now'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
