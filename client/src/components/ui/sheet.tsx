import * as React from 'react';
import { cn } from '@/utils/cn';

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext(): SheetContextValue {
  const ctx = React.useContext(SheetContext);
  if (!ctx) throw new Error('Sheet components must be used within <Sheet>');
  return ctx;
}

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const currentOpen = open !== undefined ? open : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (open === undefined) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [open, onOpenChange],
  );

  return (
    <SheetContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export interface SheetTriggerProps {
  children: React.ReactElement;
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const { setOpen } = useSheetContext();

  if (!React.isValidElement(children)) return null;

  const child = children as React.ReactElement<{
    onClick?: React.MouseEventHandler;
  }>;

  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      child.props.onClick?.(e);
      setOpen(true);
    },
  });
}

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export function SheetContent({
  className,
  children,
  side = 'left',
  ...props
}: SheetContentProps) {
  const { open, setOpen } = useSheetContext();

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  if (!open) return null;

  const sideClasses: Record<string, string> = {
    left: 'inset-y-0 left-0 h-full w-3/4 max-w-xs border-r',
    right: 'inset-y-0 right-0 h-full w-3/4 max-w-xs border-l',
    top: 'inset-x-0 top-0 w-full border-b',
    bottom: 'inset-x-0 bottom-0 w-full border-t',
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'absolute bg-card shadow-xl p-6',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          aria-label="Close"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export interface SheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}
      {...props}
    />
  );
}

export interface SheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <h2
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export interface SheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}
