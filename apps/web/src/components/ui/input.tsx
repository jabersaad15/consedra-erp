import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input className={cn('flex h-10 w-full rounded-lg border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50', className)} ref={ref} {...props} />
));
Input.displayName = 'Input';