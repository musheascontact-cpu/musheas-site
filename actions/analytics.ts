'use server';

import prisma from '@/lib/prisma';
import { startOfMonth, subMonths, format } from 'date-fns';

export async function getDashboardStats() {
  try {
    // 1. Basic Counts
    const [
      productsCount,
      ordersCount,
      subscribersCount,
      ordersData
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.newsletterSubscriber.count(),
      prisma.order.findMany({
        include: {
          order_items: {
            include: {
              product: true
            }
          }
        }
      })
    ]);

    // 2. Revenue Calculation
    const totalRevenue = ordersData
      .filter((o: any) => o.status !== 'cancelled')
      .reduce((acc: number, o: any) => acc + (Number(o.total_amount) || 0), 0);

    // 3. Revenue Trends (Last 6 months)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, 'MMM'),
        fullMonth: format(date, 'MMMM'),
        year: date.getFullYear(),
        amount: 0,
        timestamp: startOfMonth(date).getTime()
      };
    }).reverse();

    ordersData.forEach((order: any) => {
      if (order.status === 'cancelled') return;
      const orderDate = new Date(order.created_at);
      const orderMonth = startOfMonth(orderDate).getTime();
      
      const monthStat = last6Months.find((m: any) => m.timestamp === orderMonth);
      if (monthStat) {
        monthStat.amount += Number(order.total_amount) || 0;
      }
    });

    // 4. Order Status Distribution
    const statusDistribution = [
      { name: 'Pending', value: ordersData.filter((o: any) => o.status === 'pending').length, color: '#f59e0b' },
      { name: 'Processing', value: ordersData.filter((o: any) => o.status === 'processing').length, color: '#3b82f6' },
      { name: 'Shipped', value: ordersData.filter((o: any) => o.status === 'shipped').length, color: '#8b5cf6' },
      { name: 'Delivered', value: ordersData.filter((o: any) => o.status === 'delivered').length, color: '#10b981' },
      { name: 'Cancelled', value: ordersData.filter((o: any) => o.status === 'cancelled').length, color: '#ef4444' },
    ].filter(s => s.value > 0);

    // 5. Top Selling Products
    const productSales: Record<string, { name: string, image: string, total: number, quantity: number }> = {};
    
    ordersData.forEach((order: any) => {
      if (order.status === 'cancelled') return;
      order.order_items.forEach((item: any) => {
        const id = item.product_id;
        if (!productSales[id]) {
          const productName = (item.product.name as any)?.en || (item.product.name as any)?.ar || 'Unknown Product';
          productSales[id] = { 
            name: productName, 
            image: item.product.image_url,
            total: 0,
            quantity: 0
          };
        }
        productSales[id].quantity += item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      counts: {
        products: productsCount || 0,
        orders: ordersCount || 0,
        subscribers: subscribersCount || 0,
        revenue: totalRevenue
      },
      revenueTrends: last6Months,
      statusDistribution,
      topProducts
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

