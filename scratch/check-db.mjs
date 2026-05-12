import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  console.log('\n=== INQUIRIES ===');
  const inquiries = await p.inquiry.findMany({ take: 10 });
  console.log(JSON.stringify(inquiries, null, 2));

  console.log('\n=== PRODUCT IDs IN DB ===');
  const products = await p.product.findMany({ select: { id: true, name: true }, take: 10 });
  console.log(JSON.stringify(products, null, 2));
}
main().catch(e => console.error(e.message)).finally(() => p.$disconnect());
