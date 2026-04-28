'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type Promotion = {
  id: string;
  title_en: string;
  title_ar: string;
  discount_percentage: number;
  end_date: string;
  is_active: boolean;
  apply_to: 'all' | 'category' | 'product';
  category?: string | null;
  product_id?: string | null;
  color?: string;
  created_at: string;
};

// Get all promotions for dashboard
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const data = await prisma.promotion.findMany({
      orderBy: { created_at: 'desc' }
    });
    return data.map(p => ({
      ...p,
      end_date: p.end_date.toISOString(),
      created_at: p.created_at.toISOString(),
      apply_to: p.apply_to as any
    }));
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

// Get the active promotion to display on the banner
export async function getActivePromotion(): Promise<Promotion | null> {
  try {
    const p = await prisma.promotion.findFirst({
      where: {
        is_active: true,
        end_date: { gt: new Date() }
      },
      orderBy: { end_date: 'asc' }
    });

    if (!p) return null;

    return {
      ...p,
      end_date: p.end_date.toISOString(),
      created_at: p.created_at.toISOString(),
      apply_to: p.apply_to as any
    };
  } catch (error) {
    return null;
  }
}

// Get active promotion for a specific product
export async function getProductPromotion(productId: string, category?: string): Promise<Promotion | null> {
  try {
    const now = new Date();

    // 1. Product-specific
    const productPromo = await prisma.promotion.findFirst({
      where: {
        is_active: true,
        apply_to: 'product',
        product_id: productId,
        end_date: { gt: now }
      }
    });
    if (productPromo) return { ...productPromo, end_date: productPromo.end_date.toISOString(), created_at: productPromo.created_at.toISOString(), apply_to: 'product' };

    // 2. Category-specific
    if (category) {
      const catPromo = await prisma.promotion.findFirst({
        where: {
          is_active: true,
          apply_to: 'category',
          category: category,
          end_date: { gt: now }
        }
      });
      if (catPromo) return { ...catPromo, end_date: catPromo.end_date.toISOString(), created_at: catPromo.created_at.toISOString(), apply_to: 'category' };
    }

    // 3. Global
    const globalPromo = await prisma.promotion.findFirst({
      where: {
        is_active: true,
        apply_to: 'all',
        end_date: { gt: now }
      }
    });

    if (!globalPromo) return null;

    return {
      ...globalPromo,
      end_date: globalPromo.end_date.toISOString(),
      created_at: globalPromo.created_at.toISOString(),
      apply_to: 'all'
    };
  } catch (error) {
    return null;
  }
}

// Upsert a promotion
export async function upsertPromotion(formData: FormData) {
  try {
    const id = formData.get('id') as string;

    const promotionData: any = {
      title_en: formData.get('title_en'),
      title_ar: formData.get('title_ar'),
      discount_percentage: parseInt(formData.get('discount_percentage') as string),
      end_date: new Date(formData.get('end_date') as string),
      is_active: formData.get('is_active') === 'true',
      apply_to: formData.get('apply_to') || 'all',
      category: formData.get('category') || null,
      product_id: formData.get('product_id') || null,
    };

    if (id) {
      await prisma.promotion.update({
        where: { id },
        data: promotionData
      });
    } else {
      await prisma.promotion.create({
        data: promotionData
      });
    }

    revalidatePath('/[lang]/dashboard/promotions', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Upsert promotion error:', error);
    return { success: false, error: error.message };
  }
}

// Toggle promotion active state
export async function togglePromotion(id: string, is_active: boolean) {
  try {
    await prisma.promotion.update({
      where: { id },
      data: { is_active }
    });
    revalidatePath('/[lang]/dashboard/promotions', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Delete a promotion
export async function deletePromotion(id: string) {
  try {
    await prisma.promotion.delete({
      where: { id }
    });
    revalidatePath('/[lang]/dashboard/promotions', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
