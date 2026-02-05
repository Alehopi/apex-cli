import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-semantic-fg-primary',
  {
    variants: {
      variant: {
        default: 'bg-semantic-bg-elevated text-semantic-fg-primary border-semantic-border-default',
        info: 'border-semantic-status-info-border bg-semantic-status-info-bg text-semantic-status-info-fg [&>svg]:text-semantic-status-info-icon',
        success: 'border-semantic-status-success-border bg-semantic-status-success-bg text-semantic-status-success-fg [&>svg]:text-semantic-status-success-icon',
        warning: 'border-semantic-status-warning-border bg-semantic-status-warning-bg text-semantic-status-warning-fg [&>svg]:text-semantic-status-warning-icon',
        error: 'border-semantic-status-error-border bg-semantic-status-error-bg text-semantic-status-error-fg [&>svg]:text-semantic-status-error-icon',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, showIcon = true, closable, onClose, children, ...props }, ref) => {
    const [visible, setVisible] = React.useState(true);

    const handleClose = () => {
      setVisible(false);
      onClose?.();
    };

    if (!visible) return null;

    const defaultIcons = {
      default: <Info className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      success: <CheckCircle2 className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />,
      error: <XCircle className="h-4 w-4" />,
    };

    const iconToRender = icon || defaultIcons[variant || 'default'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && <span aria-hidden="true">{iconToRender}</span>}
        <div className={cn(showIcon && 'pl-7', closable && 'pr-8')}>{children}</div>
        {closable && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-semantic-offset transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-semantic-focus focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
