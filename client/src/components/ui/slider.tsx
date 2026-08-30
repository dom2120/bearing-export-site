import * as React from 'react';
import { cn } from '@/utils/cn';

export interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: SliderProps) {
  const currentValue = value[0] ?? min;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([Number(e.target.value)]);
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className={cn('relative flex w-full items-center', className)}>
      <div className="relative w-full h-2 bg-muted rounded-full">
        <div
          className="absolute h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border-2 border-white shadow-md pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}
