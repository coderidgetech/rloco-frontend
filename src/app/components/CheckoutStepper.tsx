import { Check } from 'lucide-react';
import { cn } from './ui/utils';

export type CheckoutStep = 'bag' | 'address' | 'payment';

interface CheckoutStepperProps {
  activeStep: CheckoutStep;
}

/**
 * Shared checkout progress row — same layout as /address-selection and /payment.
 */
export function CheckoutStepper({ activeStep }: CheckoutStepperProps) {
  return (
    <div className="flex items-center gap-2 text-xs md:text-sm">
      <div className={cn('flex items-center gap-2', activeStep !== 'bag' && 'text-muted-foreground')}>
        <span
          className={cn('uppercase tracking-wider', activeStep === 'bag' && 'font-medium text-primary')}
        >
          BAG
        </span>
      </div>
      <div className="h-px w-8 md:w-12 shrink-0 bg-border" aria-hidden />
      <div className={cn('flex items-center gap-2', activeStep !== 'address' && 'text-muted-foreground')}>
        <span
          className={cn('uppercase tracking-wider', activeStep === 'address' && 'font-medium text-primary')}
        >
          ADDRESS
        </span>
      </div>
      <div className="h-px w-8 md:w-12 shrink-0 bg-border" aria-hidden />
      <div className={cn('flex items-center gap-2', activeStep !== 'payment' && 'text-muted-foreground')}>
        <span
          className={cn('uppercase tracking-wider', activeStep === 'payment' && 'font-medium text-primary')}
        >
          PAYMENT
        </span>
      </div>
      <div className="ml-auto hidden md:flex items-center gap-2 text-green-600">
        <Check size={16} />
        <span className="text-xs">100% SECURE</span>
      </div>
    </div>
  );
}
