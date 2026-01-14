import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface WizardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const WizardButton = forwardRef<HTMLButtonElement, WizardButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-semibold',
      'rounded-full transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50'
    );

    const variants = {
      primary: cn(
        'bg-primary text-primary-foreground',
        'hover:bg-primary/90',
        'focus:ring-primary',
        'shadow-glow hover:shadow-glow-lg'
      ),
      secondary: cn(
        'bg-secondary text-secondary-foreground',
        'hover:bg-secondary/80',
        'focus:ring-secondary',
        'border border-border'
      ),
      ghost: cn(
        'bg-transparent text-primary',
        'hover:bg-primary/10',
        'focus:ring-primary'
      ),
      danger: cn(
        'bg-destructive text-destructive-foreground',
        'hover:bg-destructive/90',
        'focus:ring-destructive'
      ),
      success: cn(
        'bg-success text-success-foreground',
        'hover:bg-success/90',
        'focus:ring-success'
      ),
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Please wait...</span>
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  }
);

WizardButton.displayName = 'WizardButton';
