'use server';

import prisma from '@/lib/prisma';
import { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { applyPromotionsToProducts, applyPromotionToProduct } from '@/lib/promotions-utils';
import type { Promotion } from '@/actions/promotions';
import { productSchema } from '@/lib/validations/product';
import { z } from 'zod';

/**
 * Returns distinct categories from the DB for a given product type.
 * This replaces hardcoded categories from lib/data.ts.
 */
export async function getDistinctCategories(type: 'b2b' | 'b2c' | 'all' = 'all'): Promise<string[]> {
  try {
    const where: any = { is_visible: true };
    if (type === 'b2b') where.type = { in: ['b2b', 'rd'] };
    if (type === 'b2c') where.type = 'b2c';

    const products = await prisma.product.findMany({
      where,
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return products.map((p) => p.category).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

/**
 * Renames a category across all products.
 */
export async function renameCategory(oldName: string, newName: string) {
  try {
    await prisma.product.updateMany({
      where: { category: oldName },
      data: { category: newName },
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Deletes a category by clearing the category field on all associated products.
 * Or alternatively, we could move them to "Uncategorized".
 */
export async function deleteCategory(categoryName: string) {
  try {
    await prisma.product.updateMany({
      where: { category: categoryName },
      data: { category: 'Uncategorized' },
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function getPaginatedProducts({
  page = 0,
  limit = 8,
  query = '',
  category = '',
  lang = 'ar',
  type = 'b2b',
  onlyVisible = true
}: {
  page?: number;
  limit?: number;
  query?: string;
  category?: string;
  lang?: string;
  type?: 'b2b' | 'b2c' | 'rd';
  onlyVisible?: boolean;
}) {
  const skip = page * limit;
  const now = new Date();

  // Fetch all matching products by type to apply accurate memory filtering
  const [productsData, activePromotionsData] = await Promise.all([
    prisma.product.findMany({
      where: {
        type: type === 'b2b' ? { in: ['b2b', 'rd'] } : type,
        ...(onlyVisible ? { is_visible: true } : {}),
      },
      orderBy: { created_at: 'desc' },
    }),
    prisma.promotion.findMany({
      where: {
        is_active: true,
        end_date: { gt: now },
      },
    }),
  ]);

  const rawProducts: Product[] = productsData.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    salePrice: p.sale_price ? Number(p.sale_price) : undefined,
    imageUrl: p.image_url,
    imageHint: p.image_hint,
    category: p.category,
    ingredients: p.ingredients,
    application: p.application,
    benefits: p.benefits,
    type: p.type,
    is_visible: p.is_visible,
    is_featured: p.is_featured
  }));

  const activePromotions: Promotion[] = activePromotionsData.map((p: any) => ({
    ...p,
    price: p.price ? Number(p.price) : undefined,
  })) as any;

  // Apply promotions to compute effective salePrice dynamically
  const products: Product[] = applyPromotionsToProducts(rawProducts, activePromotions);

  let filtered = products;

  // Filter by category (case-insensitive)
  if (category) {
    filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  // Filter by search query (case-insensitive across both languages)
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(p => {
      // @ts-ignore
      const nameEn = (p.name?.en || '').toLowerCase();
      // @ts-ignore
      const nameAr = (p.name?.ar || '').toLowerCase();
      return nameEn.includes(q) || nameAr.includes(q);
    });
  }

  const total = filtered.length;
  const paginatedProducts = filtered.slice(skip, skip + limit);

  return {
    products: paginatedProducts,
    total,
    hasMore: skip + limit < total
  };
}

export async function searchProducts(query: string, lang: string = 'ar') {
  if (!query || query.length < 2) return [];

  const now = new Date();
  const [data, dbPromotions] = await Promise.all([
    prisma.product.findMany({
      where: { is_visible: true },
    }),
    prisma.promotion.findMany({
      where: {
        is_active: true,
        end_date: { gt: now }
      }
    })
  ]);

  const rawResults: Product[] = data.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    salePrice: p.sale_price ? Number(p.sale_price) : undefined,
    imageUrl: p.image_url,
    imageHint: p.image_hint,
    category: p.category,
    ingredients: p.ingredients,
    application: p.application,
    benefits: p.benefits,
    type: p.type,
    is_visible: p.is_visible,
    is_featured: p.is_featured
  } as Product));

  const activePromotions: Promotion[] = dbPromotions.map((p: any) => ({
    ...p,
    price: p.price ? Number(p.price) : undefined,
  })) as any;

  const products = applyPromotionsToProducts(rawResults, activePromotions);

  const q = query.toLowerCase();
  const filtered = products.filter(p => {
    // @ts-ignore
    const nameEn = (p.name?.en || '').toLowerCase();
    // @ts-ignore
    const nameAr = (p.name?.ar || '').toLowerCase();
    return nameEn.includes(q) || nameAr.includes(q);
  });

  return filtered.slice(0, 5);
}

export async function getProductBySlug(slug: string) {
  const now = new Date();
  const [p, dbPromotions] = await Promise.all([
    prisma.product.findUnique({
      where: { slug }
    }),
    prisma.promotion.findMany({
      where: {
        is_active: true,
        end_date: { gt: now }
      }
    })
  ]);

  if (!p) return null;

  const rawProduct: Product = {
    id: p.id,
    name: p.name as any,
    slug: p.slug,
    description: p.description as any,
    price: Number(p.price),
    salePrice: p.sale_price ? Number(p.sale_price) : undefined,
    imageUrl: p.image_url,
    imageHint: p.image_hint || '',
    category: p.category,
    ingredients: p.ingredients as any,
    application: p.application as any,
    benefits: p.benefits as any,
    type: p.type as any,
    is_visible: p.is_visible,
    is_featured: p.is_featured
  };

  const activePromotions: Promotion[] = dbPromotions.map((p: any) => ({
    ...p,
    price: p.price ? Number(p.price) : undefined,
  })) as any;

  return {
    ...rawProduct,
    ...applyPromotionToProduct(rawProduct, activePromotions),
  };
}



/**
 * Smart slug generator that handles collisions
 */
async function generateUniqueSlug(name: string, currentId?: string): Promise<string> {
  let slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_]+/g, '-')  // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Trim hyphens

  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true }
    });

    if (!existing || existing.id === currentId) {
      return uniqueSlug;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

export async function upsertProduct(data: any) {
  try {
    // Validate with Zod
    const validatedData = productSchema.parse(data);
    const { id, ...productFields } = validatedData;

    // Ensure slug is clean or generate one if missing
    let slug = productFields.slug;
    if (!slug || slug.trim() === '') {
      slug = await generateUniqueSlug(productFields.name_en, id);
    }

    const productData: any = {
      name: { en: productFields.name_en, ar: productFields.name_ar },
      slug,
      description: { en: productFields.description_en, ar: productFields.description_ar },
      price: productFields.price,
      sale_price: productFields.sale_price,
      image_url: productFields.image_url,
      image_hint: productFields.image_hint,
      category: productFields.category,
      type: productFields.type,
      ingredients: {
        en: productFields.ingredients_en ? productFields.ingredients_en.split(',').map(s => s.trim()) : [],
        ar: productFields.ingredients_ar ? productFields.ingredients_ar.split(',').map(s => s.trim()) : []
      },
      application: { en: productFields.application_en, ar: productFields.application_ar },
      benefits: {
        en: productFields.benefits_en ? productFields.benefits_en.split(',').map(s => s.trim()) : [],
        ar: productFields.benefits_ar ? productFields.benefits_ar.split(',').map(s => s.trim()) : []
      },
      is_visible: productFields.is_visible,
      is_featured: productFields.is_featured,
    };

    let result;
    if (id) {
      result = await prisma.product.update({
        where: { id },
        data: productData
      });
    } else {
      const newId = `prod_${Math.random().toString(36).substring(2, 10)}`;
      result = await prisma.product.create({
        data: { ...productData, id: newId }
      });
    }

    revalidatePath('/[lang]/dashboard/products', 'page');
    revalidatePath('/[lang]/products', 'page');
    revalidatePath('/[lang]/shop', 'page');

    return { success: true, product: result };
  } catch (error) {
    console.error('Error upserting product:', error);

    // 1. التحقق من أخطاء التحقق (Zod)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    // 2. التحقق من أخطاء النظام العامة
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    // 3. رسالة خطأ احتياطية
    return { success: false, error: 'Failed to save product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Check if product has dependencies (like orders)
    // Prisma delete will fail anyway if there's a constraint, but we can be proactive
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/[lang]/dashboard/products', 'page');
    revalidatePath('/[lang]/products', 'page');

    return { success: true };
  } catch (error: any) {
    console.error('Delete action failed:', error);
    let message = 'Failed to delete product';

    if (error.code === 'P2003') {
      message = 'Cannot delete this product because it is linked to existing orders.';
    }

    return { success: false, error: message };
  }
}

