import * as React from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary text-white',
  secondary: 'bg-accent text-white',
  destructive: 'bg-destructive text-white',
  outline: 'border border-border text-foreground bg-white',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
