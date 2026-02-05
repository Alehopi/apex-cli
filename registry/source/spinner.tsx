import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    variant: {
      default: 'text-semantic-fg-primary',
      primary: 'text-semantic-action-primary',
      secondary: 'text-semantic-fg-secondary',
      light: 'text-semantic-fg-inverse',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    const labelColorClass = variant === 'light'
      ? 'text-semantic-fg-inverse'
      : 'text-semantic-fg-secondary';

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || 'Loading'}
        className={cn('inline-flex items-center gap-2', className)}
        {...props}
      >
        <Loader2 className={cn(spinnerVariants({ size, variant }))} />
        {label && (
          <span className={cn('text-sm', labelColorClass)}>{label}</span>
        )}
        <span className="sr-only">{label || 'Loading'}</span>
      </div>
    );
  }
);
Spinner.displayName = 'Spinner';

export interface LoadingOverlayProps extends SpinnerProps {
  show?: boolean;
  transparent?: boolean;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ show = true, transparent = false, label = 'Loading...', ...spinnerProps }, ref) => {
    if (!show) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          transparent
            ? 'bg-transparent'
            : 'bg-semantic-bg-loading-overlay backdrop-blur-sm'
        )}
      >
        <Spinner label={label} {...spinnerProps} />
      </div>
    );
  }
);
LoadingOverlay.displayName = 'LoadingOverlay';

export { Spinner, LoadingOverlay, spinnerVariants };
