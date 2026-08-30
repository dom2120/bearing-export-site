import * as React from 'react';
import { cn } from '@/utils/cn';

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  toggle: () => void;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error('Accordion components must be used within <AccordionItem>');
  return ctx;
}

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion components must be used within <Accordion>');
  return ctx;
}

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: AccordionProps) {
  const getInitial = (): string[] => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  };

  const [openItems, setOpenItems] = React.useState<string[]>(getInitial);

  React.useEffect(() => {
    if (value !== undefined) {
      setOpenItems(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      setOpenItems((prev) => {
        const isOpen = prev.includes(itemValue);
        let next: string[];
        if (type === 'single') {
          next = isOpen ? [] : [itemValue];
        } else {
          next = isOpen
            ? prev.filter((v) => v !== itemValue)
            : [...prev, itemValue];
        }
        if (onValueChange) {
          onValueChange(type === 'single' ? next[0] ?? '' : next);
        }
        return next;
      });
    },
    [type, onValueChange],
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('divide-y divide-border', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const open = openItems.includes(value);

  return (
    <AccordionItemContext.Provider
      value={{ value, open, toggle: () => toggleItem(value) }}
    >
      <div className={cn('border-b border-border', className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const { open, toggle } = useAccordionItemContext();
  return (
    <button
      type="button"
      ref={ref}
      onClick={() => {
        toggle();
        props.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
      }}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-all hover:text-primary',
        className,
      )}
      {...props}
    >
      {children}
      <svg
        className={cn('h-4 w-4 shrink-0 transition-transform duration-200', open && 'rotate-180')}
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
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const { open } = useAccordionItemContext();
  if (!open) return null;
  return (
    <div
      className={cn(
        'overflow-hidden pb-4 text-sm text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
