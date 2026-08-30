import * as React from 'react';
import { cn } from '@/utils/cn';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

export interface TabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, defaultValue, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? value ?? '');
  const currentValue = value || internalValue;

  const setValue = React.useCallback(
    (newValue: string) => {
      if (!value) setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [value, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
  const { value: currentValue, setValue } = useTabsContext();
  const isActive = currentValue === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setValue(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-foreground shadow-sm'
          : 'hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const { value: currentValue } = useTabsContext();
  if (currentValue !== value) return null;
  return (
    <div
      role="tabpanel"
      className={cn('mt-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}
