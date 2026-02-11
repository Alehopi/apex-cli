import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const skeletonVariants = cva('animate-pulse bg-semantic-bg-tertiary', {
  variants: {
    variant: {
      default: 'rounded-md',
      circular: 'rounded-full',
      text: 'rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Width of the skeleton (CSS value) */
  width?: string | number;
  /** Height of the skeleton (CSS value) */
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(skeletonVariants({ variant }), className)}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Skeleton.displayName = 'Skeleton';

/* ---------- Preset compositions ---------- */

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of text lines */
  lines?: number;
  /** Width of the last line (CSS value) */
  lastLineWidth?: string;
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, lastLineWidth = '60%', className, ...props }, ref) => {
    return (
      <div ref={ref} role="status" aria-label="Loading text" className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className="h-4"
            style={{
              width: i === lines - 1 ? lastLineWidth : '100%',
            }}
          />
        ))}
        <span className="sr-only">Loading text...</span>
      </div>
    );
  }
);
SkeletonText.displayName = 'SkeletonText';

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading card"
        className={cn(
          'rounded-lg border border-semantic-border-default bg-semantic-bg-elevated p-6 space-y-4',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-1/3" />
            <Skeleton variant="text" className="h-3 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-2/3" />
        </div>
        <span className="sr-only">Loading card...</span>
      </div>
    );
  }
);
SkeletonCard.displayName = 'SkeletonCard';

export { Skeleton, SkeletonText, SkeletonCard, skeletonVariants };
