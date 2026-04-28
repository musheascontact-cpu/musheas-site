'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_wilaya: string;
  customer_city: string;
  customer_address: string;
  delivery_type: string;
  shipping_fee: number;
  total_amount: number;
  items: {
    product_id: string;
    quantity: number;
    price_at_time: number;
  }[];
}) {
  try {
    // 1. Manage Customer Profile (Upsert) using Prisma
    const customer = await prisma.customer.upsert({
      where: { email: orderData.customer_email },
      update: {
        name: orderData.customer_name,
        phone: orderData.customer_phone,
        wilaya: orderData.customer_wilaya,
        city: orderData.customer_city,
        address: orderData.customer_address,
        total_spent: { increment: orderData.total_amount },
        total_orders: { increment: 1 },
      },
      create: {
        name: orderData.customer_name,
        email: orderData.customer_email,
        phone: orderData.customer_phone,
        wilaya: orderData.customer_wilaya,
        city: orderData.customer_city,
        address: orderData.customer_address,
        total_spent: orderData.total_amount,
        total_orders: 1,
      },
    });

    // Generate a random tracking number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const trackingNumber = `YLD-${dateStr}-${randomStr}`;

    // 2. Create Order and Order Items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customer_id: customer.id,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          customer_wilaya: orderData.customer_wilaya,
          customer_city: orderData.customer_city,
          customer_address: orderData.customer_address,
          delivery_type: orderData.delivery_type,
          shipping_fee: orderData.shipping_fee,
          total_amount: orderData.total_amount,
          status: 'pending',
          tracking_number: trackingNumber,
          shipping_company: 'Swift Express',
          order_items: {
            create: orderData.items.map(item => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price_at_time: item.price_at_time,
            })),
          },
        },
      });

      return order;
    });

    revalidatePath('/[lang]/dashboard/orders', 'page');
    revalidatePath('/[lang]/dashboard', 'page');
    
    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) return null;

    return {
      id: order.id,
      trackingNumber: order.tracking_number || `YLD${new Date(order.created_at).getTime().toString().slice(-8)}`,
      customer: {
        firstName: order.customer_name.split(' ')[0] || '',
        lastName: order.customer_name.split(' ').slice(1).join(' ') || '',
        email: order.customer_email,
        phone: order.customer_phone,
        address: order.customer_address,
        wilaya: order.customer_wilaya,
        municipality: order.customer_city || '',
        deliveryType: order.delivery_type,
      },
      items: order.order_items.map((item: any) => ({
        id: item.id,
        product: {
          ...item.product,
          price: Number(item.product.price),
          salePrice: item.product.sale_price ? Number(item.product.sale_price) : undefined,
          imageUrl: item.product.image_url,
          imageHint: item.product.image_hint,
        },
        quantity: item.quantity,
      })),
      total: Number(order.total_amount),
      date: order.created_at,
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}
