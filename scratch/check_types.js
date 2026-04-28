const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany();
  console.log('Total products:', products.length);
  products.forEach(p => {
    console.log(`- ${p.id}: ${p.name.en} | Type: ${p.type} | Price: ${p.price}`);
  });
}

check();
