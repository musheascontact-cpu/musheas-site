import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderShippedEmail(order: any, lang: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    return;
  }

  const isAr = lang === 'ar';
  const subtotal = order.total_amount || 0;
  const shipping = order.shipping_fee || 0;
  const total = subtotal + shipping;

  const html = `
    <div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d2b26b; margin-bottom: 5px;">MUSHEAS</h1>
        <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #666;">Mycology & Biotechnology</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 20px; border: 1px solid #eee;">
        <h2 style="margin-top: 0;">${isAr ? 'تم شحن طلبك!' : 'Your order is on the way!'} 🚚</h2>
        <p>${isAr ? 'مرحباً' : 'Hello'} ${order.customer_name},</p>
        <p>${isAr ? 'يسرنا إعلامك بأن طلبك قد تم شحنه وهو في طريقه إليك الآن.' : 'We are excited to let you know that your order has been shipped and is on its way to you.'}</p>
        
        <div style="margin-top: 30px; border-top: 1px solid #ddd; pt: 20px;">
          <h3 style="font-size: 14px; text-transform: uppercase;">${isAr ? 'تفاصيل الطلب' : 'Order Summary'}</h3>
          <p style="font-size: 12px; color: #666;">#${order.id.split('-')[0].toUpperCase()}</p>
          
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            ${order.order_items?.map((item: any) => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <strong>${item.products?.name?.[isAr ? 'ar' : 'en'] || item.products?.name?.en}</strong><br/>
                  <span style="font-size: 12px; color: #666;">${item.quantity} × ${item.price_at_time?.toLocaleString()} DZD</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
                  ${(item.quantity * item.price_at_time)?.toLocaleString()} DZD
                </td>
              </tr>
            `).join('')}
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <p style="margin: 5px 0;">${isAr ? 'المجموع الفرعي' : 'Subtotal'}: <strong>${subtotal.toLocaleString()} DZD</strong></p>
            <p style="margin: 5px 0;">${isAr ? 'التوصيل' : 'Shipping'}: <strong>${shipping.toLocaleString()} DZD</strong></p>
            <h3 style="margin-top: 10px; color: #d2b26b;">${isAr ? 'الإجمالي' : 'Total'}: ${total.toLocaleString()} DZD</h3>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
        <p>${isAr ? 'شكراً لشرائك من MUSHEAS' : 'Thank you for shopping with MUSHEAS'}</p>
        <p>Algiers, Algeria | contact@musheas.com</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'MUSHEAS <onboarding@resend.dev>', // Change to your verified domain in production
      to: order.customer_email,
      subject: isAr ? `تم شحن طلبك #${order.id.split('-')[0].toUpperCase()}` : `Order Shipped #${order.id.split('-')[0].toUpperCase()}`,
      html: html,
    });
    console.log('Order shipped email sent to:', order.customer_email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
