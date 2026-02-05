import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-focus focus-visible:ring-offset-2 ring-offset-semantic-offset disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-semantic-action-primary text-semantic-fg-inverse hover:bg-semantic-action-primary-hover disabled:bg-semantic-action-primary-disabled-bg disabled:text-semantic-action-primary-disabled-fg',
        secondary: 'bg-semantic-bg-sunken text-semantic-fg-primary hover:bg-semantic-bg-hover disabled:bg-semantic-bg-disabled disabled:text-semantic-fg-disabled',
        outline: 'border border-semantic-border-strong bg-semantic-bg-elevated hover:bg-semantic-bg-hover hover:text-semantic-fg-primary disabled:border-semantic-border-default disabled:text-semantic-fg-disabled',
        ghost: 'hover:bg-semantic-bg-hover hover:text-semantic-fg-primary disabled:text-semantic-fg-disabled',
        danger: 'bg-semantic-action-danger text-semantic-fg-inverse hover:bg-semantic-action-danger-hover disabled:bg-semantic-action-danger-disabled-bg disabled:text-semantic-action-danger-disabled-fg',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {!isLoading && leftIcon && <span className="mr-2" aria-hidden="true">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
