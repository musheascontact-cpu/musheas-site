import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, lang: string = 'en') {
  // Use a fixed locale format to avoid hydration mismatches
  // We'll use 'en-US' or similar if we want consistent separators, 
  // or explicitly pass the lang to Intl.NumberFormat
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(amount);
}
