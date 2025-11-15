import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: any): string {
  if (!date) return '';
  
  // Handle Firestore Timestamp
  if (date.toDate) {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date.toDate());
  }
  
  // Handle regular Date
  if (date instanceof Date) {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
  
  return '';
}

export function formatRelativeTime(date: any): string {
  if (!date) return '';
  
  const now = new Date();
  const then = date.toDate ? date.toDate() : new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  
  return formatDate(date);
}

