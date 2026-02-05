import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-semantic-offset',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-semantic-badge-default-bg text-semantic-badge-default-fg hover:opacity-80',
        secondary: 'border-transparent bg-semantic-badge-secondary-bg text-semantic-badge-secondary-fg hover:opacity-80',
        success: 'border-transparent bg-semantic-status-success-solid text-semantic-fg-inverse hover:opacity-80',
        warning: 'border-transparent bg-semantic-status-warning-solid text-semantic-fg-inverse hover:opacity-80',
        error: 'border-transparent bg-semantic-status-error-icon text-semantic-fg-inverse hover:opacity-80',
        outline: 'text-semantic-badge-outline-fg border-semantic-badge-outline-border hover:bg-semantic-bg-hover',
      },
      size: {
        sm: 'px-2 py-0 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
