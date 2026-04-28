'use server';

import prisma from '@/lib/prisma';

export async function getCustomers() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { created_at: 'desc' }
    });

    const customerMap: Record<string, any> = {};

    orders.forEach(order => {
      const email = order.customer_email?.toLowerCase() || 'unknown';
      
      if (!customerMap[email]) {
        customerMap[email] = {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          address: order.customer_address,
          wilaya: order.customer_wilaya,
          totalSpent: 0,
          orderCount: 0,
          lastOrder: order.created_at,
          orders: []
        };
      }

      if (order.status !== 'cancelled') {
        customerMap[email].totalSpent += (Number(order.total_amount) || 0);
      }
      customerMap[email].orderCount += 1;
      
      // Keep the most recent address/phone info
      if (new Date(order.created_at) > new Date(customerMap[email].lastOrder)) {
        customerMap[email].name = order.customer_name;
        customerMap[email].phone = order.customer_phone;
        customerMap[email].address = order.customer_address;
        customerMap[email].wilaya = order.customer_wilaya;
        customerMap[email].lastOrder = order.created_at;
      }
    });

    return Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

