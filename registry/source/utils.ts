import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Uses clsx to handle conditional classes and tailwind-merge to resolve conflicts
 *
 * @example
 * cn('px-4 py-2', isLarge && 'px-6 py-3', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
