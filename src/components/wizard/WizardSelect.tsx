import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, type LucideIcon } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface WizardSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: readonly Option[];
  error?: string;
  icon?: LucideIcon;
  onChange?: (value: string) => void;
}

export const WizardSelect = forwardRef<HTMLSelectElement, WizardSelectProps>(
  ({ label, options, error, icon: Icon, className, onChange, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground/80">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
        
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          )}
          
          <select
            ref={ref}
            className={cn(
              'flex h-12 w-full appearance-none rounded-lg border bg-input px-4 py-3 text-base',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200 cursor-pointer',
              Icon && 'pl-11',
              'pr-10',
              error && 'border-destructive focus:ring-destructive',
              !error && 'border-border hover:border-primary/50',
              className
            )}
            onChange={(e) => onChange?.(e.target.value)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-card">
                {option.label}
              </option>
            ))}
          </select>
          
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
        
        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

WizardSelect.displayName = 'WizardSelect';
