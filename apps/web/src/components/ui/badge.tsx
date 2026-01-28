import { cn } from '@/lib/utils';
const vs: Record<string,string> = { default:'bg-blue-100 text-blue-700', success:'bg-green-100 text-green-700', warning:'bg-yellow-100 text-yellow-700', destructive:'bg-red-100 text-red-700', secondary:'bg-gray-100 text-gray-600' };
export function Badge({ children, variant='default', className }: { children: React.ReactNode; variant?: keyof typeof vs; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', vs[variant], className)}>{children}</span>;
}