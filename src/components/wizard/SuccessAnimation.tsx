import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  className?: string;
}

export function SuccessAnimation({ className }: SuccessAnimationProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        {/* Pulse rings */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-success/20',
          animate && 'animate-pulse-ring'
        )} />
        <div className={cn(
          'absolute inset-0 rounded-full bg-success/10',
          animate && 'animate-pulse-ring',
          'animation-delay-300'
        )} style={{ animationDelay: '0.3s' }} />
        
        {/* Main circle */}
        <div className={cn(
          'relative flex items-center justify-center w-24 h-24 rounded-full',
          'bg-success/20 border-2 border-success',
          animate && 'animate-bounce-in'
        )}>
          {/* Checkmark SVG */}
          <svg
            className="w-12 h-12 text-success"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points="20 6 9 17 4 12"
              className={cn(
                animate && 'animate-checkmark'
              )}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
