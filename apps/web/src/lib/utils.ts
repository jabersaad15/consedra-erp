import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(d: string|Date, locale='en') { return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(d)); }
export function formatCurrency(n: number, cur='SAR', locale='en') { return new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(n); }