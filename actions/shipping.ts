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
    if (deliveryType === 'office') {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });
      
      if (order) {
        const wilayaCode = Number(order.customer_wilaya) || 1;
        const communes = await SwiftExpressService.getCommunes(wilayaCode);
        
        if (Array.isArray(communes)) {
          const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          const normalizedInput = normalize(order.customer_city || '');
          
          let hasStopDesk = false;
          const exact = communes.find((c: any) => normalize(c.nom) === normalizedInput);
          if (exact) {
            hasStopDesk = exact.has_stop_desk === 1;
          } else {
            const partial = communes.find((c: any) => normalize(c.nom).includes(normalizedInput) || normalizedInput.includes(normalize(c.nom)));
            if (partial) {
              hasStopDesk = partial.has_stop_desk === 1;
            }
          }

          if (!hasStopDesk) {
            return { 
              success: false, 
              error: 'لا يمكن تغيير التوصيل للمكتب، البلدية الحالية للزبون لا تتوفر على مكتب توصيل.' 
            };
          }
        }
      }
    }

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

export async function getCommunesByWilaya(wilayaId: number) {
  try {
    const communes = await SwiftExpressService.getCommunes(wilayaId);
    return { success: true, communes };
  } catch (error: any) {
    console.error('Error fetching communes:', error);
    return { success: false, error: error.message };
  }
}
