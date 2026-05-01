import * as z from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name_en: z.string().min(2, 'English name must be at least 2 characters'),
  name_ar: z.string().min(2, 'Arabic name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description_en: z.string().min(10, 'English description must be at least 10 characters'),
  description_ar: z.string().min(10, 'Arabic description must be at least 10 characters'),
  price: z.string().or(z.number()).transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Price must be a positive number'),
  sale_price: z.string().or(z.number()).optional().nullable().transform((val) => val === '' || val === null || val === undefined ? null : Number(val)).refine((val) => val === null || (!isNaN(val) && val >= 0), 'Sale price must be a positive number'),
  image_url: z.string().url('Invalid image URL').min(1, 'Product image is required'),
  image_hint: z.string().optional().nullable(),
  category: z.string().min(2, 'Category is required'),
  type: z.enum(['b2b', 'b2c', 'rd']),
  ingredients_en: z.string().optional().nullable(),
  ingredients_ar: z.string().optional().nullable(),
  application_en: z.string().optional().nullable(),
  application_ar: z.string().optional().nullable(),
  benefits_en: z.string().optional().nullable(),
  benefits_ar: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_visible: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
