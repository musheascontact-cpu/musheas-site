'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPartners() {
  try {
    const data = await prisma.partner.findMany({
      orderBy: { display_order: 'asc' }
    });
    return data;
  } catch (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
}

export async function upsertPartner(partner: any) {
  try {
    // Placeholder auth check
    
    const { id, ...data } = partner;
    
    if (id) {
      await prisma.partner.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date()
        }
      });
    } else {
      await prisma.partner.create({
        data: {
          ...data,
          updated_at: new Date()
        }
      });
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving partner:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePartner(id: string) {
  try {
    // Placeholder auth check
    
    await prisma.partner.delete({
      where: { id }
    });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting partner:', error);
    return { success: false, error: error.message };
  }
}
