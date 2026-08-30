import * as React from 'react';
import { cn } from '@/utils/cn';

interface SelectContextValue {
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error('Select components must be used within <Select>');
  return ctx;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, defaultValue, children }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : internalValue;

  const setValue = React.useCallback(
    (newValue: string) => {
      if (value === undefined) setInternalValue(newValue);
      onValueChange?.(newValue);
      setOpen(false);
    },
    [value, onValueChange],
  );

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{ value: currentValue, setValue, open, setOpen, triggerRef }}
    >
      <div className="relative inline-block w-full" ref={contentRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useSelectContext();
  return (
    <button
      type="button"
      ref={(el) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
        }
      }}
      onClick={() => setOpen(!open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 opacity-50 ml-2 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useSelectContext();
  return (
    <span className={cn('truncate', !value && 'text-muted-foreground')}>
      {value || placeholder || ''}
    </span>
  );
}

export interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
}

export function SelectContent({ className, children }: SelectContentProps) {
  const { open } = useSelectContext();
  if (!open) return null;
  return (
    <div
      className={cn(
        'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-white p-1 shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function SelectItem({ className, value, children, ...props }: SelectItemProps) {
  const { value: currentValue, setValue } = useSelectContext();
  const isSelected = currentValue === value;
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => setValue(value)}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none',
        'hover:bg-muted focus:bg-muted',
        isSelected && 'bg-primary/10 text-primary font-medium',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
