import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface WizardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export const WizardInput = forwardRef<HTMLInputElement, WizardInputProps>(
  ({ label, error, icon: Icon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
        
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'flex h-12 w-full rounded-lg border bg-input px-4 py-3 text-base',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              Icon && 'pl-11',
              isPassword && 'pr-11',
              error && 'border-destructive focus:ring-destructive',
              !error && 'border-border hover:border-primary/50',
              className
            )}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

WizardInput.displayName = 'WizardInput';
