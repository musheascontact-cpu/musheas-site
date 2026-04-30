'use server';

import prisma from '@/lib/prisma';
import { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { applyPromotionsToProducts, applyPromotionToProduct } from '@/lib/promotions-utils';
import type { Promotion } from '@/actions/promotions';
import { productSchema } from '@/lib/validations/product';
import { z } from 'zod';

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

  // Fetch products and active promotions in parallel
  const [productsData, totalCount, activePromotionsData] = await Promise.all([
    prisma.product.findMany({
      where: {
        type: type === 'b2b' ? { in: ['b2b', 'rd'] } : type,
        ...(onlyVisible ? { is_visible: true } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({
      where: {
        type: type === 'b2b' ? { in: ['b2b', 'rd'] } : type,
        ...(onlyVisible ? { is_visible: true } : {}),
        ...(category ? { category } : {}),
      },
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

  // Filtering by query in JS (Prisma can't easily filter inside JSON fields without specialized DB features, so keeping JS filter for now)
  let filtered = products;
  if (query) {
    filtered = products.filter(p =>
      // @ts-ignore
      p.name[lang as 'en' | 'ar']?.toLowerCase().includes(query.toLowerCase())
    );
  }

  return {
    products: filtered,
    total: totalCount,
    hasMore: skip + limit < totalCount
  };
}

export async function searchProducts(query: string, lang: string = 'ar') {
  if (!query || query.length < 2) return [];

  const now = new Date();
  const [data, dbPromotions] = await Promise.all([
    prisma.product.findMany({
      where: { is_visible: true },
      take: 5,
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

  const results = applyPromotionsToProducts(rawResults, activePromotions);

  return results.filter(p => 
    // @ts-ignore
    p.name[lang as 'en' | 'ar']?.toLowerCase().includes(query.toLowerCase())
  );
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
  } catch (error: any) {
    console.error('Error upserting product:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: error.message || 'Failed to save product' };
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

