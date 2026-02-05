import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '../../lib/utils';

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      label,
      labelPosition = 'center',
      ...props
    },
    ref
  ) => {
    if (!label) {
      return (
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            'shrink-0 bg-semantic-border-default',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            className
          )}
          {...props}
        />
      );
    }

    // Divider with label (only for horizontal)
    if (orientation === 'vertical') {
      return (
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn('h-full w-[1px] shrink-0 bg-semantic-border-default', className)}
          {...props}
        />
      );
    }

    const labelPositionClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
      <div className={cn('flex w-full items-center', labelPositionClasses[labelPosition])}>
        {labelPosition !== 'left' && (
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className="h-[1px] flex-1 bg-semantic-border-default"
          />
        )}
        <span className="px-3 text-xs font-medium text-semantic-fg-secondary">{label}</span>
        {labelPosition !== 'right' && (
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className="h-[1px] flex-1 bg-semantic-border-default"
          />
        )}
      </div>
    );
  }
);
Divider.displayName = 'Divider';

export { Divider };
