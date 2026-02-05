import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Visual style variant of the input
   */
  variant?: 'default' | 'error';

  /**
   * Size of the input field
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Label text displayed above the input
   */
  label?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message displayed below the input
   */
  errorMessage?: string;

  /**
   * Icon to display on the left side of the input
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display on the right side of the input
   */
  rightIcon?: React.ReactNode;

  /**
   * Whether the field is required
   */
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      required,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    // Determine if we should show error state
    const hasError = variant === 'error' || !!errorMessage;

    // Base styles for the input container
    const containerStyles = 'flex flex-col gap-1.5';

    // Label styles
    const labelStyles = 'text-sm font-medium text-semantic-fg-secondary';

    // Input wrapper styles (for icon support)
    const wrapperStyles = 'relative flex items-center';

    // Base input styles
    const baseInputStyles = `
      w-full
      rounded-md
      border
      bg-semantic-control-bg
      text-semantic-control-fg
      placeholder:text-semantic-control-placeholder
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-offset-0
      disabled:cursor-not-allowed
      disabled:bg-semantic-bg-disabled
      disabled:text-semantic-fg-disabled
    `.trim().replace(/\s+/g, ' ');

    // Variant styles
    const variantStyles = {
      default: `
        border-semantic-control-border
        hover:border-semantic-control-border-hover
        focus:border-semantic-border-focus
        focus:ring-semantic-focus
      `.trim().replace(/\s+/g, ' '),
      error: `
        border-semantic-control-border-error
        hover:border-semantic-control-border-error
        focus:border-semantic-control-border-error
        focus:ring-semantic-control-border-error
      `.trim().replace(/\s+/g, ' '),
    };

    // Size styles
    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    // Adjust padding for icons
    const iconPaddingStyles = {
      left: {
        sm: 'pl-9',
        md: 'pl-10',
        lg: 'pl-12',
      },
      right: {
        sm: 'pr-9',
        md: 'pr-10',
        lg: 'pr-12',
      },
    };

    // Icon container styles
    const iconContainerStyles = {
      base: 'absolute flex items-center justify-center text-semantic-control-icon',
      left: {
        sm: 'left-2.5 w-4 h-4',
        md: 'left-3 w-4 h-4',
        lg: 'left-3.5 w-5 h-5',
      },
      right: {
        sm: 'right-2.5 w-4 h-4',
        md: 'right-3 w-4 h-4',
        lg: 'right-3.5 w-5 h-5',
      },
    };

    // Combine all input classes
    const inputClassName = [
      baseInputStyles,
      variantStyles[hasError ? 'error' : 'default'],
      sizeStyles[size],
      leftIcon && iconPaddingStyles.left[size],
      rightIcon && iconPaddingStyles.right[size],
      className,
    ].filter(Boolean).join(' ');

    // Helper/Error text styles
    const messageStyles = hasError
      ? 'text-sm text-semantic-fg-error'
      : 'text-sm text-semantic-fg-secondary';

    return (
      <div className={containerStyles}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
            {required && <span className="text-semantic-fg-error ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper with icons */}
        <div className={wrapperStyles}>
          {/* Left icon */}
          {leftIcon && (
            <div
              className={`${iconContainerStyles.base} ${iconContainerStyles.left[size]}`}
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={inputClassName}
            disabled={disabled}
            aria-invalid={hasError}
            aria-required={required}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div
              className={`${iconContainerStyles.base} ${iconContainerStyles.right[size]}`}
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(errorMessage || helperText) && (
          <p className={messageStyles}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export default Input;
