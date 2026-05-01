import { upsertProduct, deleteProduct } from '@/actions/products';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await upsertProduct(data);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const result = await deleteProduct(id);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API delete error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    
    // For partial updates like toggle visibility, we can still use the database directly 
    // or call a dedicated action. Since upsertProduct handles full validation, 
    // we'll stick to a direct update for patches to avoid requiring full data for toggles.
    
    // Note: In a production environment, you might want a separate 'toggleVisibility' action.
    const result = await prisma.product.update({
      where: { id },
      data: updates
    });

    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error('API patch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

