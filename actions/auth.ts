'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

/**
 * Creates an initial admin user if none exists.
 * Used for the first-time setup.
 */
export async function createInitialAdmin() {
  try {
    const adminExists = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (adminExists) {
      return { success: false, error: 'Admin already exists' };
    }

    const hashedPassword = await bcrypt.hash('#NaBiLyahia1996', 10);
    
    await prisma.user.create({
      data: {
        email: 'admin@musheas.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error('Failed to create admin:', error);
    return { success: false, error: error.message };
  }
}

export async function login(formData: FormData) {
  // Login is handled on the client side using next-auth/react's signIn
  // This server action is kept for potential server-side logic
  return { success: true, message: 'Use signIn from next-auth/react on the client' };
}

export async function logout() {
  // Logout is handled on the client side using next-auth/react's signOut
  revalidatePath('/', 'layout');
  return { success: true };
}
