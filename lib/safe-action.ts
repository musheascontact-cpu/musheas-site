import { z } from 'zod';

export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; validationErrors?: z.ZodIssue[] };

/**
 * A "Protection Shield" wrapper for server actions.
 * Ensures consistent error handling, validation, and logging.
 */
export async function safeAction<T, S extends z.ZodType>(
  schema: S,
  data: unknown,
  handler: (validatedData: z.infer<S>) => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    // 1. Validation Shield
    const validationResult = schema.safeParse(data);
    
    if (!validationResult.success) {
      console.warn('Action Validation Failed:', validationResult.error.format());
      return { 
        success: false, 
        error: 'بيانات غير صالحة، يرجى مراجعة الحقول.',
        validationErrors: validationResult.error.issues 
      };
    }

    // 2. Execution Shield
    const result = await handler(validationResult.data);
    
    return { success: true, data: result };
  } catch (error: any) {
    // 3. Error Shield (Logging & Masking)
    console.error('Critical Action Error:', error);
    
    let userMessage = 'حدث خطأ غير متوقع في النظام، يرجى المحاولة لاحقاً.';
    
    // Specific DB errors
    if (error.code === 'P2002') {
      userMessage = 'هذا السجل موجود بالفعل (قيمة مكررة).';
    } else if (error.code === 'P2003') {
      userMessage = 'لا يمكن حذف السجل لوجود بيانات مرتبطة به.';
    }

    return { success: false, error: userMessage };
  }
}
