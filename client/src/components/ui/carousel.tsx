import * as React from 'react';
import { cn } from '@/utils/cn';

export interface CarouselApi {
  selectedScrollSnap: () => number;
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
  canScrollNext: () => boolean;
  canScrollPrev: () => boolean;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

interface CarouselContextValue {
  apiRef: React.MutableRefObject<CarouselApi | null>;
  setApi: (api: CarouselApi | null) => void;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarouselContext(): CarouselContextValue {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel components must be used within <Carousel>');
  return ctx;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  setApi?: (api: CarouselApi) => void;
  opts?: { loop?: boolean };
}

export function Carousel({ className, children, setApi, opts, ...props }: CarouselProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [api, setInternalApi] = React.useState<CarouselApi | null>(null);
  const listenersRef = React.useRef<Record<string, (() => void)[]>>({});

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const getCount = () => viewport.children.length;
    const getCurrent = () => {
      const scrollLeft = viewport.scrollLeft;
      const itemWidth = viewport.clientWidth;
      return Math.round(scrollLeft / itemWidth);
    };

    const apiImpl: CarouselApi = {
      selectedScrollSnap: () => getCurrent(),
      scrollNext: () => {
        const next = getCurrent() + 1;
        if (next < getCount()) {
          viewport.scrollTo({ left: next * viewport.clientWidth, behavior: 'smooth' });
        } else if (opts?.loop) {
          viewport.scrollTo({ left: 0, behavior: 'smooth' });
        }
      },
      scrollPrev: () => {
        const prev = getCurrent() - 1;
        if (prev >= 0) {
          viewport.scrollTo({ left: prev * viewport.clientWidth, behavior: 'smooth' });
        } else if (opts?.loop) {
          viewport.scrollTo({
            left: (getCount() - 1) * viewport.clientWidth,
            behavior: 'smooth',
          });
        }
      },
      scrollTo: (index: number) => {
        viewport.scrollTo({ left: index * viewport.clientWidth, behavior: 'smooth' });
      },
      canScrollNext: () => getCurrent() < getCount() - 1,
      canScrollPrev: () => getCurrent() > 0,
      on: (event: string, handler: () => void) => {
        if (!listenersRef.current[event]) listenersRef.current[event] = [];
        listenersRef.current[event].push(handler);
      },
      off: (event: string, handler: () => void) => {
        listenersRef.current[event] =
          listenersRef.current[event]?.filter((h) => h !== handler) ?? [];
      },
    };

    const handleScroll = () => {
      listenersRef.current.select?.forEach((h) => h());
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    setInternalApi(apiImpl);
    setApi?.(apiImpl);

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
    };
  }, [setApi, opts?.loop]);

  return (
    <CarouselContext.Provider
      value={{
        apiRef: { current: api },
        setApi: setInternalApi,
      }}
    >
      <div className={cn('relative', className)} {...props} data-carousel-root="">
        <div
          ref={viewportRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CarouselContent({ children }: CarouselContentProps) {
  return <>{children}</>;
}

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CarouselItem({ className, children, ...props }: CarouselItemProps) {
  return (
    <div
      className={cn('min-w-full shrink-0 snap-start', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CarouselPreviousProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function CarouselPrevious({ className, ...props }: CarouselPreviousProps) {
  const { apiRef } = useCarouselContext();
  return (
    <button
      type="button"
      onClick={() => apiRef.current?.scrollPrev()}
      className={cn(
        'absolute left-4 top-1/2 -translate-y-1/2 z-10',
        'h-10 w-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-foreground hover:bg-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      disabled={!apiRef.current?.canScrollPrev()}
      {...props}
      aria-label="Previous slide"
    >
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

export interface CarouselNextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function CarouselNext({ className, ...props }: CarouselNextProps) {
  const { apiRef } = useCarouselContext();
  return (
    <button
      type="button"
      onClick={() => apiRef.current?.scrollNext()}
      className={cn(
        'absolute right-4 top-1/2 -translate-y-1/2 z-10',
        'h-10 w-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-foreground hover:bg-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      disabled={!apiRef.current?.canScrollNext()}
      {...props}
      aria-label="Next slide"
    >
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}
