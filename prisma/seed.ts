import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { products as mockProducts } from '../lib/data'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // 1. Admin User
  const adminEmail = 'admin@musheas.com'
  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('#NaBiLyahia1996', 10)
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
      }
    })
    console.log('Admin user created: admin@musheas.com / #NaBiLyahia1996')
  }

  // 2. Products (from lib/data.ts)
  console.log(`Seeding ${mockProducts.length} products...`)
  for (const p of mockProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        sale_price: p.salePrice || null,
        image_url: p.imageUrl,
        image_hint: p.imageHint || '',
        category: p.category,
        ingredients: p.ingredients,
        application: p.application,
        benefits: p.benefits,
        type: p.type,
        is_visible: true,
      },
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        sale_price: p.salePrice || null,
        image_url: p.imageUrl,
        image_hint: p.imageHint || '',
        category: p.category,
        ingredients: p.ingredients,
        application: p.application,
        benefits: p.benefits,
        type: p.type,
        is_visible: true,
      },
    })
  }

  // 3. Site Content
  const siteContent = [
    { key: 'hero_title_1', value: { en: "Where", ar: "حيث تلتقي" } },
    { key: 'hero_title_2', value: { en: "Mycology", ar: "الفطريات" } },
    { key: 'hero_title_3', value: { en: "Meets Biotechnology", ar: "بالبيوتكنولوجيا" } },
    { key: 'hero_description', value: { en: "We are a premier producer of mushroom-based cosmetic actives...", ar: "نحن منتج رائد للمكونات التجميلية النشطة القائمة على الفطر..." } },
    
    // About Page
    { key: 'about_hero_image', value: { en: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop', ar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop' } },
    { key: 'about_story_image', value: { en: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop', ar: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop' } },
    { key: 'about_mission_image', value: { en: 'https://images.unsplash.com/photo-1532187863486-abf51ad9469e?q=80&w=1000&auto=format&fit=crop', ar: 'https://images.unsplash.com/photo-1532187863486-abf51ad9469e?q=80&w=1000&auto=format&fit=crop' } },
    { key: 'about_vision_image', value: { en: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', ar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop' } },

    // Contact Page
    { key: 'contact_hero_image', value: { en: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop', ar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop' } },
    { key: 'contact_location_image', value: { en: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1600&auto=format&fit=crop', ar: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1600&auto=format&fit=crop' } },
    { key: 'contact_email_value', value: { en: 'contact@musheas.com', ar: 'contact@musheas.com' } },
    { key: 'contact_phone_value', value: { en: '+213 (0) 555 00 00 00', ar: '+213 (0) 555 00 00 00' } },
    { key: 'contact_address_value', value: { en: 'Algiers, Algeria', ar: 'الجزائر العاصمة، الجزائر' } },
    { key: 'contact_working_hours', value: { en: 'Our team is available Sunday to Thursday, 9:00 AM to 5:00 PM.', ar: 'فريقنا متاح من الأحد إلى الخميس، من الساعة 9 صباحاً حتى 5 مساءً.' } },
  ]

  for (const c of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      update: c,
      create: c,
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
