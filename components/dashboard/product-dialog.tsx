'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Plus, Edit, Loader2 } from 'lucide-react';
// Using fetch API instead of server action for reliability
import { useToast } from '@/components/ui/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';

const productSchema = z.object({
  id: z.string().optional(),
  name_en: z.string().min(2, 'English name is required'),
  name_ar: z.string().min(2, 'Arabic name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description_en: z.string().min(10, 'English description is required'),
  description_ar: z.string().min(10, 'Arabic description is required'),
  price: z.string().refine((val) => !isNaN(Number(val)), 'Price must be a number'),
  sale_price: z.string().optional().refine((val) => !val || !isNaN(Number(val)), 'Sale price must be a number'),
  image_url: z.string().min(1, 'Product image is required'),
  image_hint: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  type: z.enum(['b2b', 'b2c']),
  ingredients_en: z.string().optional(),
  ingredients_ar: z.string().optional(),
  application_en: z.string().optional(),
  application_ar: z.string().optional(),
  benefits_en: z.string().optional(),
  benefits_ar: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  product?: any; // For editing
  lang: string;
}

export function ProductDialog({ product, lang }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const defaultValues: any = product
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  });

  async function onSubmit(data: ProductFormValues) {
    console.log('Submitting product data:', data);
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('API response:', response.status, result);

      if (result.success) {
        setOpen(false);
        if (!product) form.reset();
        toast({
          title: isAr ? 'تم بنجاح ✓' : 'Success ✓',
          description: isAr ? 'تم حفظ المنتج بنجاح' : 'Product saved successfully',
        });
      } else {
        toast({
          variant: 'destructive',
          title: isAr ? 'خطأ في الخادم' : 'Server Error',
          description: result.error || 'Unknown error',
        });
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast({
        variant: 'destructive',
        title: isAr ? 'خطأ في الاتصال' : 'Connection Error',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onError = (errors: any) => {
    console.error('Validation Errors:', errors);
    const firstError = Object.values(errors)[0] as any;
    const errorMessage = firstError?.message || (isAr ? 'يرجى التحقق من الحقول المطلوبة.' : 'Please check required fields.');
    
    toast({
      variant: 'destructive',
      title: isAr ? 'بيانات غير مكتملة' : 'Incomplete Data',
      description: errorMessage,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button type="button" className="gap-2">
            <Plus className="h-4 w-4" />
            {isAr ? 'إضافة منتج' : 'Add Product'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product
              ? isAr ? 'تعديل المنتج' : 'Edit Product'
              : isAr ? 'إضافة منتج جديد' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isAr ? 'املأ البيانات أدناه لإضافة أو تعديل المنتج.' : 'Fill in the details below to add or edit the product.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* English Name */}
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Arabic Name */}
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم (بالعربية)</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="product-slug-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Extracts, Powders, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (DZD)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sale Price */}
              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price (DZD) - Optional</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <ImageUpload 
                        value={field.value || ''} 
                        onChange={field.onChange} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="b2b">B2B (Business)</SelectItem>
                        <SelectItem value="b2c">B2C (Consumer)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (English)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
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
                    <FormLabel>الوصف (بالعربية)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ingredients & Benefits (Comma separated lists) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ingredients_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients (EN, comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>المكونات (بالعربية، مفصولة بفاصلة)</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="benefits_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefits (EN, comma separated)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>الفوائد (بالعربية، مفصولة بفاصلة)</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" dir="rtl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 border rounded-xl p-4 bg-muted/20">
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between w-full">
                      <div className="space-y-0.5">
                        <FormLabel>{isAr ? 'منتج مميز' : 'Featured Product'}</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          {isAr ? 'عرض المنتج في الواجهة' : 'Show on home page'}
                        </p>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-5 w-5 rounded border-muted bg-background text-primary focus:ring-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-2 border rounded-xl p-4 bg-muted/20 border-blue-100 dark:border-blue-900/30">
                <FormField
                  control={form.control}
                  name="is_visible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between w-full">
                      <div className="space-y-0.5">
                        <FormLabel>{isAr ? 'ظهور المنتج' : 'Product Visibility'}</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          {isAr ? 'إخفاء أو إظهار المنتج في المتجر' : 'Hide or show product in store'}
                        </p>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-5 w-5 rounded border-muted bg-background text-primary focus:ring-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isAr ? 'جاري المعالجة...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {product
                      ? isAr ? 'حفظ التغييرات' : 'Save Changes'
                      : isAr ? 'إضافة المنتج الآن' : 'Add Product Now'}
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
