const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany();
  console.log('Total products:', products.length);
  products.forEach(p => {
    console.log(`- ${p.id}: ${p.name.en} | Price: ${p.price} | Sale: ${p.sale_price} | Visible: ${p.is_visible}`);
  });
  
  const promos = await prisma.promotion.findMany({
    where: { is_active: true }
  });
  console.log('\nActive Promotions:', promos.length);
  promos.forEach(p => {
    console.log(`- ${p.id}: ${p.title_en} | ${p.discount_percentage}% | Ends: ${p.end_date}`);
  });
}

check();
