import * as React from 'react';
import { cn } from '@/utils/cn';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(): DialogContextValue {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>');
  return ctx;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
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
    <DialogContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  const { setOpen } = useDialogContext();

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

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  const { open, setOpen } = useDialogContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        ref={contentRef}
        className={cn(
          'relative z-10 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl',
          'max-h-[85vh] overflow-auto',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}
      {...props}
    />
  );
}

export interface DialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6',
        className,
      )}
      {...props}
    />
  );
}

export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <h2
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export function DialogClose() {
  const { setOpen } = useDialogContext();
  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
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
  );
}
