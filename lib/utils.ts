import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, lang: string = 'en') {
  // Use 'en-US' to ensure Latin numerals (1, 2, 3) are used
  // This also ensures consistency for hydration
  return new Intl.NumberFormat('en-US').format(amount);
}
