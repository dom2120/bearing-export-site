import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export interface BreadcrumbListProps
  extends React.HTMLAttributes<HTMLOListElement> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5',
        className,
      )}
      {...props}
    />
  );
}

export interface BreadcrumbItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

export interface BreadcrumbLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export function BreadcrumbLink({ to, className, children }: BreadcrumbLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'transition-colors hover:text-foreground hover:underline underline-offset-2',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export interface BreadcrumbPageProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-medium text-foreground', className)}
      {...props}
    />
  );
}

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLLIElement> {}

export function BreadcrumbSeparator({
  className,
  children,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
      {...props}
    >
      {children || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </li>
  );
}
