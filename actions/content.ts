'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';

/**
 * Fetches all site content with caching enabled.
 * Uses 'site-content' tag for on-demand revalidation.
 */
export const getSiteContent = unstable_cache(
  async () => {
    try {
      const data = await prisma.siteContent.findMany();
      return data;
    } catch (error) {
      console.error('Error fetching site content:', error);
      return [];
    }
  },
  ['site-content'],
  { tags: ['site-content'] }
);

export async function updateSiteContent(key: string, value: any) {
  try {
    // Placeholder auth check
    
    await prisma.siteContent.upsert({
      where: { key },
      update: { value, updated_at: new Date() },
      create: { key, value }
    });

    // Purge the specific cache tag to reflect changes immediately
    revalidateTag('site-content');
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating site content:', error);
    return { success: false, error: error.message };
  }
}
