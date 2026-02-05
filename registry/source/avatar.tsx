import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  alt: string;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, alt, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    alt={alt}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-semantic-bg-sunken font-medium text-semantic-fg-primary',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export interface AvatarWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  description?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const AvatarWithLabel = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarWithLabelProps
>(({ src, alt, fallback, size = 'md', label, description, status, className, ...props }, ref) => {
  const statusColors = {
    online: 'bg-semantic-indicator-online',
    offline: 'bg-semantic-indicator-offline',
    away: 'bg-semantic-indicator-away',
    busy: 'bg-semantic-indicator-busy',
  };

  const statusSizes = {
    sm: 'h-2 w-2 border',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-4 w-4 border-2',
  };

  const avatarComponent = (
    <div className="relative">
      <Avatar size={size} className={className} ref={ref} {...props}>
        {src && <AvatarImage src={src} alt={alt || ''} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full border-semantic-indicator-border',
            statusColors[status],
            statusSizes[size]
          )}
          role="status"
          aria-label={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      )}
    </div>
  );

  if (!label && !description) {
    return avatarComponent;
  }

  return (
    <div className="flex items-center gap-3">
      {avatarComponent}
      <div className="flex flex-col">
        {label && (
          <span className="text-sm font-medium text-semantic-fg-primary">{label}</span>
        )}
        {description && (
          <span className="text-xs text-semantic-fg-secondary">{description}</span>
        )}
      </div>
    </div>
  );
});
AvatarWithLabel.displayName = 'AvatarWithLabel';

export { Avatar, AvatarImage, AvatarFallback, AvatarWithLabel };
