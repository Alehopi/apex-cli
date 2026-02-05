import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

export interface ThemeTogglerProps {
  /** Show system option alongside light/dark */
  showSystem?: boolean;
  /** Size of the toggler */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { button: 'h-9 w-9', icon: 'h-5 w-5' },
  lg: { button: 'h-10 w-10', icon: 'h-6 w-6' },
};

export function ThemeToggler({ showSystem = false, size = 'md', className }: ThemeTogglerProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { button: buttonSize, icon: iconSize } = sizeMap[size];

  if (showSystem) {
    return (
      <div role="radiogroup" aria-label="Theme selector" className={cn('inline-flex items-center rounded-lg border border-semantic-border-default bg-semantic-bg-sunken p-1', className)}>
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'light'}
          onClick={() => setTheme('light')}
          className={cn(
            'inline-flex items-center justify-center rounded-md p-1.5 transition-colors',
            theme === 'light'
              ? 'bg-semantic-bg-segment-active text-semantic-fg-segment-active shadow-sm'
              : 'text-semantic-fg-muted hover:text-semantic-fg-secondary'
          )}
          aria-label="Light mode"
        >
          <Sun className={iconSize} aria-hidden="true" />
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'dark'}
          onClick={() => setTheme('dark')}
          className={cn(
            'inline-flex items-center justify-center rounded-md p-1.5 transition-colors',
            theme === 'dark'
              ? 'bg-semantic-bg-segment-active text-semantic-fg-segment-active shadow-sm'
              : 'text-semantic-fg-muted hover:text-semantic-fg-secondary'
          )}
          aria-label="Dark mode"
        >
          <Moon className={iconSize} aria-hidden="true" />
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'system'}
          onClick={() => setTheme('system')}
          className={cn(
            'inline-flex items-center justify-center rounded-md p-1.5 transition-colors',
            theme === 'system'
              ? 'bg-semantic-bg-segment-active text-semantic-fg-segment-active shadow-sm'
              : 'text-semantic-fg-muted hover:text-semantic-fg-secondary'
          )}
          aria-label="System theme"
        >
          <Monitor className={iconSize} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        buttonSize,
        'inline-flex items-center justify-center rounded-md border border-semantic-border-default bg-semantic-bg-elevated text-semantic-fg-secondary transition-colors hover:bg-semantic-bg-hover hover:text-semantic-fg-primary',
        className
      )}
      aria-label={resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {resolvedTheme === 'light' ? (
        <Moon className={iconSize} aria-hidden="true" />
      ) : (
        <Sun className={iconSize} aria-hidden="true" />
      )}
    </button>
  );
}
