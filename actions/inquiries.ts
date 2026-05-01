'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  product_id: z.string().optional(),
});

export type InquiryData = z.infer<typeof inquirySchema>;

export async function submitInquiry(data: InquiryData) {
  try {
    const validatedData = inquirySchema.parse(data);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject || 'B2B Inquiry',
        message: validatedData.message,
        product_id: validatedData.product_id,
        status: 'new',
      },
    });

    revalidatePath('/dashboard/inquiries');
    
    return { success: true, inquiryId: inquiry.id };
  } catch (error: any) {
    console.error('Inquiry Submission Error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'Failed to submit inquiry. Please try again.' };
  }
}
