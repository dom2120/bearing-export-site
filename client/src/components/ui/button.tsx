import * as React from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
  secondary: 'bg-accent text-white hover:bg-accent/90 shadow-sm',
  outline:
    'border border-border bg-white text-foreground hover:bg-muted hover:text-foreground',
  ghost: 'text-foreground hover:bg-muted',
  destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-sm',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', asChild = false, children, ...props },
    ref,
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wide transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
