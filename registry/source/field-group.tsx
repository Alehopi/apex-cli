import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const fieldGroupVariants = cva('space-y-2', {
  variants: {
    spacing: {
      sm: 'space-y-1',
      md: 'space-y-2',
      lg: 'space-y-3',
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
});

export interface FieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldGroupVariants> {
  /** Field label element */
  label?: React.ReactNode;
  /** Helper text element */
  helperText?: React.ReactNode;
  /** Error message element */
  error?: React.ReactNode;
  /** The input/field element */
  children: React.ReactNode;
}

const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, spacing, label, helperText, error, children, ...props }, ref) => {
    const labelId = React.useId();

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        className={cn(fieldGroupVariants({ spacing }), className)}
        {...props}
      >
        {label && <div id={labelId}>{label}</div>}
        <div>{children}</div>
        {error ? <div>{error}</div> : helperText ? <div>{helperText}</div> : null}
      </div>
    );
  }
);

FieldGroup.displayName = 'FieldGroup';

export { FieldGroup, fieldGroupVariants };
