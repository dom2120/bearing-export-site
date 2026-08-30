import * as React from 'react';
import { cn } from '@/utils/cn';

type AlertVariant = 'default' | 'destructive';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const variantClasses: Record<AlertVariant, string> = {
  default: 'bg-primary/10 text-primary border-primary/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <h5
      className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  );
}
