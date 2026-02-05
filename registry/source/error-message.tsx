import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const errorMessageVariants = cva(
  'flex items-start gap-2 text-sm text-semantic-fg-error',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof errorMessageVariants> {
  /** Show error icon */
  showIcon?: boolean;
}

const ErrorMessage = React.forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ className, size, showIcon = true, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(errorMessageVariants({ size }), className)}
        role="alert"
        aria-live="assertive"
        {...props}
      >
        {showIcon && (
          <AlertCircle className={cn('flex-shrink-0', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} aria-hidden="true" />
        )}
        <span>{children}</span>
      </p>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';

export { ErrorMessage, errorMessageVariants };
