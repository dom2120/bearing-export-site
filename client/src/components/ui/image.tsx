import * as React from 'react';
import { cn } from '@/utils/cn';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [error, setError] = React.useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setError(true);
      if (props.onError) props.onError(e);
    };

    if (error && fallback) {
      return (
        <img
          ref={ref}
          src={fallback}
          alt={alt}
          className={cn('object-cover', className)}
          {...props}
        />
      );
    }

    if (error) {
      return (
        <div
          className={cn(
            'flex items-center justify-center bg-muted text-muted-foreground text-xs',
            className,
          )}
        >
          {alt || 'No Image'}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        onError={handleError}
        loading={props.loading || 'lazy'}
        className={cn('object-cover', className)}
        {...props}
      />
    );
  },
);
Image.displayName = 'Image';
