import { cn } from '@/lib/utils';

interface WizardCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function WizardCard({ children, className, variant = 'elevated' }: WizardCardProps) {
  const variants = {
    default: 'bg-card',
    elevated: 'bg-card card-glow',
    outlined: 'bg-transparent border-2 border-border',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 sm:p-8',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

interface WizardCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function WizardCardHeader({ children, className }: WizardCardHeaderProps) {
  return (
    <div className={cn('mb-6 text-center', className)}>
      {children}
    </div>
  );
}

interface WizardCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function WizardCardTitle({ children, className }: WizardCardTitleProps) {
  return (
    <h2 className={cn('text-2xl font-bold text-foreground', className)}>
      {children}
    </h2>
  );
}

interface WizardCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function WizardCardDescription({ children, className }: WizardCardDescriptionProps) {
  return (
    <p className={cn('mt-2 text-muted-foreground', className)}>
      {children}
    </p>
  );
}

interface WizardCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function WizardCardBody({ children, className }: WizardCardBodyProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

interface WizardCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function WizardCardFooter({ children, className }: WizardCardFooterProps) {
  return (
    <div className={cn('mt-8 flex flex-col gap-3', className)}>
      {children}
    </div>
  );
}
