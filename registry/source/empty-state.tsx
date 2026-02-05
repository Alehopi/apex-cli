import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      variant: {
        default: 'py-12 px-6',
        minimal: 'py-8 px-4',
        card: 'py-12 px-6 bg-semantic-bg-elevated border border-semantic-border-default rounded-lg shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action element (typically a Button) */
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, variant, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={title}
        className={cn(emptyStateVariants({ variant }), className)}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              'mb-4 flex items-center justify-center text-semantic-fg-disabled',
              variant === 'minimal' && 'mb-3'
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <h3
          className={cn(
            'font-semibold text-semantic-fg-primary',
            variant === 'minimal' ? 'text-base' : 'text-lg'
          )}
        >
          {title}
        </h3>

        {description && (
          <p
            className={cn(
              'mt-2 max-w-sm text-semantic-fg-muted',
              variant === 'minimal' ? 'text-xs' : 'text-sm'
            )}
          >
            {description}
          </p>
        )}

        {action && (
          <div className={cn('mt-6', variant === 'minimal' && 'mt-4')}>
            {action}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState, emptyStateVariants };
