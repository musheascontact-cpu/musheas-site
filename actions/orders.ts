'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { SwiftExpressService, SwiftExpressOrderData } from '@/lib/services/swift-express';

// Helper to get session (Placeholder for now, you should implement your own auth)
async function getSession() {
  // For now, we assume authorized if this is called from the server
  // In a real app, use NextAuth or similar to check session
  return { user: { id: 'admin' } };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getSession();
  if (!session.user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    if (status === 'shipped') {
      try {
        const orderData = await getOrderDetails(orderId);
        if (orderData) {
          const { sendOrderShippedEmail } = await import('@/lib/email');
          // @ts-ignore - Adjusting for Prisma type differences
          await sendOrderShippedEmail(orderData, 'ar');
        }
      } catch (e) {
        console.error('Failed to trigger email automation:', e);
      }
    }

    revalidatePath('/[lang]/dashboard/orders', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const data = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            product: true
          }
        }
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}

/**
 * Fetch the correct commune name in French from EcoTrack
 * to avoid "Commune mal écrite" errors
 */
async function getValidCommune(wilayaCode: number, communeInput: string): Promise<string> {
  try {
    const communes = await SwiftExpressService.getCommunes(wilayaCode);

    if (!communes || !Array.isArray(communes)) return communeInput;

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const normalizedInput = normalize(communeInput);

    const exact = communes.find(
      (c: any) => normalize(c.nom) === normalizedInput
    );
    if (exact) return exact.nom;

    const partial = communes.find(
      (c: any) =>
        normalize(c.nom).includes(normalizedInput) ||
        normalizedInput.includes(normalize(c.nom))
    );
    if (partial) return partial.nom;

    console.warn(
      `No commune match found for "${communeInput}" in wilaya ${wilayaCode}. Using: ${communes[0]?.nom}`
    );
    return communes[0]?.nom || communeInput;
  } catch (e) {
    console.error('Failed to fetch communes:', e);
    return communeInput;
  }
}

export async function createSwiftExpressShipment(orderId: string) {
  const session = await getSession();
  if (!session.user) return { success: false, error: 'Unauthorized' };

  const order = await getOrderDetails(orderId);
  if (!order) return { success: false, error: 'Order not found' };

  try {
    const wilayaCode = Number(order.customer_wilaya) || 1;
    const rawCommune = order.customer_city || '';

    const validCommune = await getValidCommune(wilayaCode, rawCommune);

    const shipmentData: SwiftExpressOrderData = {
      reference: order.id,
      nom_client: (order.customer_name || 'Customer').trim(),
      telephone: (order.customer_phone || '').replace(/\s/g, '').replace('+213', '0').replace(/^213/, '0'),
      adresse: order.customer_address || '',
      commune: validCommune,
      code_wilaya: wilayaCode,
      montant: Math.round(Number(order.total_amount)), // API might expect integer or rounded decimal
      type: 1,
      stop_desk: order.delivery_type === 'office' ? 1 : 0,
      produit: order.order_items?.length > 0 
        ? order.order_items.map((item: any) => {
            const name = typeof item.product.name === 'string' 
              ? item.product.name 
              : (item.product.name.en || item.product.name.ar || 'Product');
            return `${name} x${item.quantity}`;
          }).join(', ')
        : 'Product',
    };

    console.log('Final Shipment Data:', shipmentData);
    const result = await SwiftExpressService.createOrder(shipmentData);

    if (result && result.tracking) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          tracking_id: result.tracking,
          shipment_id: String(result.id),
          status: 'shipped',
          shipping_status: 'Prêt à expédier',
        }
      });

      revalidatePath('/[lang]/dashboard/orders', 'page');
      return { success: true, tracking: result.tracking };
    } else {
      return { success: false, error: result.message || 'API error' };
    }
  } catch (error: any) {
    console.error('Swift Express Error:', error);
    return { success: false, error: error.message };
  }
}
