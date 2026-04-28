'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitInquiry(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  product_id?: string;
}) {
  try {
    await prisma.inquiry.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        product_id: formData.product_id,
        status: 'new'
      }
    });

    revalidatePath('/[lang]/dashboard/inquiries', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting inquiry:', error);
    return { success: false, error: error.message };
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  try {
    // Placeholder auth check
    // In a real app, verify session here
    
    await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    revalidatePath('/[lang]/dashboard/inquiries', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating inquiry status:', error);
    return { success: false, error: error.message };
  }
}
