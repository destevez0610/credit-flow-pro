import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 3 }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step} className="flex items-center">
            {/* Step dot/circle */}
            <div
              className={cn(
                'step-dot flex items-center justify-center rounded-full font-medium text-sm',
                isCompleted && 'h-8 w-8 bg-success text-success-foreground',
                isActive && 'h-8 w-8 bg-primary text-primary-foreground ring-4 ring-primary/20',
                !isCompleted && !isActive && 'h-8 w-8 bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{step}</span>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'h-0.5 w-12 mx-2 transition-colors duration-300',
                  isCompleted ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
