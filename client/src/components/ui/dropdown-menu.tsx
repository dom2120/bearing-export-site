import * as React from 'react';
import { cn } from '@/utils/cn';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(): DropdownMenuContextValue {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu components must be used within <DropdownMenu>');
  return ctx;
}

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownMenuContext();

  if (!React.isValidElement(children)) return null;

  const child = children as React.ReactElement<{
    onClick?: React.MouseEventHandler;
    ref?: React.Ref<HTMLButtonElement>;
  }>;

  return React.cloneElement(child, {
    ref: (el: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
      const originalRef = child.props.ref;
      if (typeof originalRef === 'function') originalRef(el);
    },
    onClick: (e: React.MouseEvent) => {
      child.props.onClick?.(e);
      setOpen(!open);
    },
  });
}

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export function DropdownMenuContent({
  className,
  children,
  align = 'end',
  ...props
}: DropdownMenuContentProps) {
  const { open } = useDropdownMenuContext();
  if (!open) return null;

  const alignClass = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }[align];

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[10rem] overflow-hidden rounded-md border border-border bg-white p-1 shadow-lg',
        alignClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuItem({ className, ...props }: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'hover:bg-muted focus:bg-muted',
        className,
      )}
      {...props}
    />
  );
}

export interface DropdownMenuLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuLabel({ className, ...props }: DropdownMenuLabelProps) {
  return (
    <div
      className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', className)}
      {...props}
    />
  );
}

export interface DropdownMenuSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  );
}
