'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const NewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;
  
  const result = NewsletterSchema.safeParse({ email });
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    await prisma.newsletterSubscriber.create({
      data: { email }
    });
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') { // Prisma Unique constraint violation
      return { success: false, error: 'You are already subscribed!' };
    }
    return { success: false, error: error.message };
  }
}

export async function getSubscribers() {
  try {
    const data = await prisma.newsletterSubscriber.findMany({
      orderBy: { created_at: 'desc' }
    });
    return data;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
}
