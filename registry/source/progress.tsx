import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressVariants = cva('relative h-4 w-full overflow-hidden rounded-full', {
  variants: {
    variant: {
      default: 'bg-semantic-progress-track',
      success: 'bg-semantic-progress-success-track',
      warning: 'bg-semantic-progress-warning-track',
      error: 'bg-semantic-progress-error-track',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-semantic-progress-fill',
        success: 'bg-semantic-progress-success-fill',
        warning: 'bg-semantic-progress-warning-fill',
        error: 'bg-semantic-progress-error-fill',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showLabel?: boolean;
  label?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, variant, showLabel, label, ...props }, ref) => {
  const progressValue = Math.min(Math.max(value || 0, 0), 100);

  return (
    <div className="w-full space-y-2" aria-live="polite">
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-semantic-fg-secondary">
            {label || 'Progress'}
          </span>
          {showLabel && (
            <span className="font-medium text-semantic-fg-primary">
              {progressValue}%
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ variant }), className)}
        value={progressValue}
        aria-label={label || 'Progress'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressValue}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(progressIndicatorVariants({ variant }))}
          style={{ transform: `translateX(-${100 - progressValue}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants };
