import * as React from 'react';
import { cn } from '@/utils/cn';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    const isChecked = checked ?? false;

    return (
      <label className={cn('relative inline-flex h-6 w-11 items-center cursor-pointer', className)}>
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <span
          className={cn(
            'absolute inset-0 rounded-full transition-colors',
            isChecked ? 'bg-primary' : 'bg-muted',
          )}
        />
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            isChecked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </label>
    );
  },
);
Switch.displayName = 'Switch';
