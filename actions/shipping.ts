'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { SwiftExpressService } from '@/lib/services/swift-express';

export async function updateShippingFee(orderId: string, shippingFee: number) {
  try {
    // 1. Get order items to calculate subtotal
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { order_items: true }
    });

    if (!order) {
      console.error('Order not found for update:', orderId);
      return { success: false, error: 'Order not found' };
    }

    const subtotal = order.order_items.reduce((acc: number, item: any) => acc + (Number(item.price_at_time) * item.quantity), 0);
    const totalAmount = subtotal + Number(shippingFee);

    // 2. Update both shipping fee and total amount
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        shipping_fee: shippingFee,
        total_amount: totalAmount
      }
    });

    revalidatePath('/[lang]/dashboard/orders', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating shipping fee:', error);
    return { success: false, error: error.message };
  }
}

export async function updateDeliveryType(orderId: string, deliveryType: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { delivery_type: deliveryType }
    });

    revalidatePath('/[lang]/dashboard/orders', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating delivery type:', error);
    return { success: false, error: error.message };
  }
}


export async function getShippingRates() {
  try {
    const fees = await SwiftExpressService.getFees();
    // EcoTrack usually returns an object with a 'livraison' array
    const rates = fees?.livraison || fees;
    return { success: true, fees: rates };
  } catch (error: any) {
    console.error('Error fetching shipping rates:', error);
    return { success: false, error: error.message };
  }
}
