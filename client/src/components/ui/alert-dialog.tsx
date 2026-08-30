import * as React from 'react';
import { cn } from '@/utils/cn';

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext(): AlertDialogContextValue {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) throw new Error('AlertDialog components must be used within <AlertDialog>');
  return ctx;
}

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
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
    <AlertDialogContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export interface AlertDialogTriggerProps {
  children: React.ReactElement;
}

export function AlertDialogTrigger({ children }: AlertDialogTriggerProps) {
  const { setOpen } = useAlertDialogContext();

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

export interface AlertDialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AlertDialogContent({
  className,
  children,
  ...props
}: AlertDialogContentProps) {
  const { open, setOpen } = useAlertDialogContext();

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export interface AlertDialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-2 text-center sm:text-left mb-4', className)}
      {...props}
    />
  );
}

export interface AlertDialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 gap-2 sm:gap-0',
        className,
      )}
      {...props}
    />
  );
}

export interface AlertDialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <h2
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export interface AlertDialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export interface AlertDialogActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function AlertDialogAction({ className, children, ...props }: AlertDialogActionProps) {
  const { setOpen } = useAlertDialogContext();
  return (
    <button
      type="button"
      onClick={() => {
        props.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
        setOpen(false);
      }}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface AlertDialogCancelProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function AlertDialogCancel({ className, children, ...props }: AlertDialogCancelProps) {
  const { setOpen } = useAlertDialogContext();
  return (
    <button
      type="button"
      onClick={() => {
        props.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
        setOpen(false);
      }}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
