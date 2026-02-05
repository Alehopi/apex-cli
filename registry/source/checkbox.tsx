import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

// ===================
// CHECKBOX PRIMITIVE
// ===================

const CheckboxRoot = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    error?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, error = false, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer shrink-0 rounded border-2 ring-offset-semantic-offset transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-focus focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-semantic-control-bg-checked data-[state=checked]:text-semantic-fg-inverse data-[state=checked]:border-semantic-control-bg-checked',
        'data-[state=indeterminate]:bg-semantic-control-bg-checked data-[state=indeterminate]:text-semantic-fg-inverse data-[state=indeterminate]:border-semantic-control-bg-checked',
        error
          ? 'border-semantic-control-border-error data-[state=checked]:bg-semantic-action-danger data-[state=checked]:border-semantic-action-danger'
          : 'border-semantic-control-border hover:border-semantic-control-border-hover',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {props.checked === 'indeterminate' ? (
          <Minus size={iconSizes[size]} strokeWidth={3} />
        ) : (
          <Check size={iconSizes[size]} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
CheckboxRoot.displayName = CheckboxPrimitive.Root.displayName;

// ===================
// CHECKBOX WITH LABEL (Componente completo)
// ===================

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'type'> {
  /** Label text */
  label?: string;
  /** Helper text shown below checkbox */
  helperText?: string;
  /** Error message shown when error={true} */
  errorMessage?: string;
  /** Error state */
  error?: boolean;
  /** Checkbox size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes for the container */
  containerClassName?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      label,
      helperText,
      errorMessage,
      error = false,
      size = 'md',
      id,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || React.useId();
    const helperTextId = `${checkboxId}-helper`;
    const errorMessageId = `${checkboxId}-error`;

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        <div className="flex items-start gap-2">
          <CheckboxRoot
            ref={ref}
            id={checkboxId}
            error={error}
            size={size}
            className={className}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error && errorMessage
                ? errorMessageId
                : helperText
                  ? helperTextId
                  : undefined
            }
            {...props}
          />

          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'cursor-pointer select-none font-medium leading-none',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
                error ? 'text-semantic-fg-error' : 'text-semantic-fg-primary'
              )}
            >
              {label}
            </label>
          )}
        </div>

        {!error && helperText && (
          <p
            id={helperTextId}
            className={cn(
              'text-sm text-semantic-fg-secondary',
              size === 'sm' ? 'ml-6' : size === 'lg' ? 'ml-8' : 'ml-7',
              'mt-1.5'
            )}
          >
            {helperText}
          </p>
        )}

        {error && errorMessage && (
          <p
            id={errorMessageId}
            className={cn(
              'text-sm text-semantic-fg-error',
              size === 'sm' ? 'ml-6' : size === 'lg' ? 'ml-8' : 'ml-7',
              'mt-1.5'
            )}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// ===================
// EXPORTS
// ===================

export { Checkbox, CheckboxRoot };
