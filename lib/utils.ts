import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a localized date format
 * @param dateString - ISO date string to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(dateString: string | undefined, options?: {
  includeYear?: boolean;
  fallback?: string;
  relative?: boolean;
}) {
  if (!dateString) return options?.fallback || 'Recently';
  
  const date = new Date(dateString);
  
  // Relative time formatting (e.g., "2 days ago")
  if (options?.relative) {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
  
  // Standard date formatting
  return date.toLocaleDateString('en-US', { 
    year: options?.includeYear !== false ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric'
  });
}
