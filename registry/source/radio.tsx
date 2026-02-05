import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSizes = {
    sm: 8,
    md: 10,
    lg: 12,
  };

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square rounded-full border-2 border-semantic-control-border text-semantic-control-bg-checked ring-offset-semantic-offset',
        'transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-semantic-focus focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-semantic-control-bg-checked data-[state=checked]:bg-semantic-control-bg',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="fill-current text-current" size={iconSizes[size]} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupWrapperProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'children'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  error?: boolean;
  options: RadioOption[];
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'vertical' | 'horizontal';
}

const RadioGroupWrapper = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupWrapperProps
>(
  (
    {
      label,
      helperText,
      errorMessage,
      error = false,
      options,
      size = 'md',
      orientation = 'vertical',
      className,
      ...props
    },
    ref
  ) => {
    const groupId = React.useId();
    const helperTextId = `${groupId}-helper`;
    const errorMessageId = `${groupId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-semantic-fg-secondary">
            {label}
          </label>
        )}

        <RadioGroup
          ref={ref}
          className={cn(
            orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'grid gap-3',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error && errorMessage ? errorMessageId : helperText ? helperTextId : undefined
          }
          {...props}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-start gap-2">
              <RadioGroupItem id={option.value} value={option.value} size={size} disabled={option.disabled} />
              <div className="flex flex-col">
                <label
                  htmlFor={option.value}
                  className={cn(
                    'cursor-pointer select-none font-medium leading-none',
                    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
                    option.disabled && 'cursor-not-allowed opacity-70',
                    'text-semantic-fg-primary'
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p
                    className={cn(
                      'text-semantic-fg-secondary',
                      size === 'sm' ? 'text-xs mt-0.5' : 'text-sm mt-1'
                    )}
                  >
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>

        {!error && helperText && (
          <p id={helperTextId} className="mt-2 text-sm text-semantic-fg-secondary">
            {helperText}
          </p>
        )}

        {error && errorMessage && (
          <p id={errorMessageId} className="mt-2 text-sm text-semantic-fg-error">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
RadioGroupWrapper.displayName = 'RadioGroupWrapper';

export { RadioGroup, RadioGroupItem, RadioGroupWrapper };
