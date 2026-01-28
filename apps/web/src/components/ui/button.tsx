import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'default'|'destructive'|'outline'|'secondary'|'ghost'; size?: 'default'|'sm'|'lg'|'icon'; asChild?: boolean; }
const v: Record<string,string> = { default:'bg-brand-600 text-white hover:bg-brand-700 shadow-sm', destructive:'bg-red-600 text-white hover:bg-red-700', outline:'border bg-transparent hover:bg-muted', secondary:'bg-muted hover:bg-muted/80', ghost:'hover:bg-muted' };
const s: Record<string,string> = { default:'h-10 px-4 py-2', sm:'h-9 px-3 text-sm', lg:'h-11 px-8', icon:'h-10 w-10' };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant='default', size='default', asChild, ...props }, ref) => {
  const C = asChild ? Slot : 'button';
  return <C className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', v[variant], s[size], className)} ref={ref} {...props} />;
});
Button.displayName = 'Button';