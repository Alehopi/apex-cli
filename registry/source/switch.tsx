import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

const SwitchRoot = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14',
  };

  const thumbSizeClasses = {
    sm: 'h-4 w-4 data-[state=checked]:translate-x-4',
    md: 'h-5 w-5 data-[state=checked]:translate-x-5',
    lg: 'h-6 w-6 data-[state=checked]:translate-x-7',
  };

  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-focus focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:bg-semantic-bg-disabled',
        'data-[state=checked]:bg-semantic-control-bg-checked data-[state=unchecked]:bg-semantic-control-unchecked',
        sizeClasses[size],
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform',
          'data-[state=unchecked]:translate-x-0',
          thumbSizeClasses[size]
        )}
      />
    </SwitchPrimitive.Root>
  );
});
SwitchRoot.displayName = SwitchPrimitive.Root.displayName;

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  labelPosition?: 'left' | 'right';
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, label, description, size = 'md', labelPosition = 'right', id, ...props }, ref) => {
    const switchId = id || React.useId();

    const switchElement = <SwitchRoot ref={ref} id={switchId} size={size} {...props} />;

    if (!label) {
      return switchElement;
    }

    return (
      <div className={cn('flex items-start gap-3', className)}>
        {labelPosition === 'left' && (
          <div className="flex-1">
            <label
              htmlFor={switchId}
              className="cursor-pointer select-none text-sm font-medium leading-none text-semantic-fg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
            {description && (
              <p className="mt-1 text-sm text-semantic-fg-secondary">{description}</p>
            )}
          </div>
        )}

        {switchElement}

        {labelPosition === 'right' && (
          <div className="flex-1">
            <label
              htmlFor={switchId}
              className="cursor-pointer select-none text-sm font-medium leading-none text-semantic-fg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
            {description && (
              <p className="mt-1 text-sm text-semantic-fg-secondary">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch, SwitchRoot };
