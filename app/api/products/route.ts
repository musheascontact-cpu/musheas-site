import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      id,
      name_en, name_ar,
      slug,
      description_en, description_ar,
      price,
      sale_price,
      image_url,
      image_hint,
      category,
      type,
      ingredients_en, ingredients_ar,
      application_en, application_ar,
      benefits_en, benefits_ar,
      is_visible, is_featured,
    } = data;

    const productData: any = {
      name: { en: name_en, ar: name_ar },
      slug,
      description: { en: description_en, ar: description_ar },
      price: parseFloat(price),
      sale_price: sale_price ? parseFloat(sale_price) : null,
      image_url,
      image_hint: image_hint || '',
      category,
      type,
      ingredients: {
        en: ingredients_en ? ingredients_en.split(',').map((s: string) => s.trim()) : [],
        ar: ingredients_ar ? ingredients_ar.split(',').map((s: string) => s.trim()) : []
      },
      application: { en: application_en || '', ar: application_ar || '' },
      benefits: {
        en: benefits_en ? benefits_en.split(',').map((s: string) => s.trim()) : [],
        ar: benefits_ar ? benefits_ar.split(',').map((s: string) => s.trim()) : []
      },
      is_visible: is_visible !== undefined ? is_visible : true,
      is_featured: is_featured !== undefined ? is_featured : false,
    };

    if (id) {
      await prisma.product.update({
        where: { id },
        data: productData
      });
    } else {
      const newId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await prisma.product.create({
        data: { ...productData, id: newId }
      });
    }

    revalidatePath('/[lang]/dashboard/products', 'page');
    revalidatePath('/[lang]/products', 'page');
    revalidatePath('/[lang]/shop', 'page');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/[lang]/dashboard/products', 'page');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API delete error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();

    await prisma.product.update({
      where: { id },
      data: updates
    });

    revalidatePath('/[lang]/dashboard/products', 'page');
    revalidatePath('/[lang]/products', 'page');
    revalidatePath('/[lang]/shop', 'page');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API patch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
