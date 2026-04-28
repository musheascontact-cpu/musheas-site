'use server';

import prisma from '@/lib/prisma';
import { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { applyPromotionsToProducts, applyPromotionToProduct } from '@/lib/promotions-utils';
import type { Promotion } from '@/actions/promotions';

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
  type?: 'b2b' | 'b2c';
  onlyVisible?: boolean;
}) {
  const skip = page * limit;
  const now = new Date();

  // Fetch products and active promotions in parallel
  const [productsData, totalCount, activePromotionsData] = await Promise.all([
    prisma.product.findMany({
      where: {
        type,
        ...(onlyVisible ? { is_visible: true } : {}),
        ...(category ? { category } : {}),
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({
      where: {
        type,
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

export async function upsertProduct(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const name_en = formData.get('name_en') as string;
    const name_ar = formData.get('name_ar') as string;
    const slug = formData.get('slug') as string;
    const description_en = formData.get('description_en') as string;
    const description_ar = formData.get('description_ar') as string;
    const price = parseFloat(formData.get('price') as string);
    const sale_price = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null;
    const image_url = formData.get('image_url') as string;
    const image_hint = formData.get('image_hint') as string;
    const category = formData.get('category') as string;
    const type = formData.get('type') as string;
    const ingredients_en = formData.get('ingredients_en') as string;
    const ingredients_ar = formData.get('ingredients_ar') as string;
    const application_en = formData.get('application_en') as string;
    const application_ar = formData.get('application_ar') as string;
    const benefits_en = formData.get('benefits_en') as string;
    const benefits_ar = formData.get('benefits_ar') as string;
    const is_visible = formData.get('is_visible') === 'true';
    const is_featured = formData.get('is_featured') === 'true';

    const productData: any = {
      name: { en: name_en, ar: name_ar },
      slug,
      description: { en: description_en, ar: description_ar },
      price,
      sale_price,
      image_url,
      image_hint,
      category,
      type,
      ingredients: {
        en: ingredients_en ? ingredients_en.split(',').map(s => s.trim()) : [],
        ar: ingredients_ar ? ingredients_ar.split(',').map(s => s.trim()) : []
      },
      application: { en: application_en, ar: application_ar },
      benefits: {
        en: benefits_en ? benefits_en.split(',').map(s => s.trim()) : [],
        ar: benefits_ar ? benefits_ar.split(',').map(s => s.trim()) : []
      },
      is_visible,
      is_featured,
    };

    if (id) {
      await prisma.product.update({
        where: { id },
        data: productData
      });
    } else {
      const newId = `prod_${Math.random().toString(36).substring(2, 10)}`;
      await prisma.product.create({
        data: { ...productData, id: newId }
      });
    }

    revalidatePath('/[lang]/dashboard/products', 'page');
    revalidatePath('/[lang]/products', 'page');
    revalidatePath('/[lang]/shop', 'page');

    return { success: true };
  } catch (error: any) {
    console.error('Error upserting product:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    
    revalidatePath('/[lang]/dashboard/products', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Delete action failed:', error);
    return { success: false, error: error.message };
  }
}
