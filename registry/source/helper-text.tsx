import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const helperTextVariants = cva('text-sm', {
  variants: {
    variant: {
      default: 'text-semantic-fg-secondary',
      muted: 'text-semantic-fg-muted',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface HelperTextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof helperTextVariants> {}

const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(helperTextVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

HelperText.displayName = 'HelperText';

export { HelperText, helperTextVariants };
