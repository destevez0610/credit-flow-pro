import { useEffect } from 'react';
import { Calendar, FileText, ArrowRight } from 'lucide-react';
import { WizardCard, WizardCardHeader, WizardCardTitle, WizardCardDescription, WizardCardBody, WizardCardFooter } from '../WizardCard';
import { WizardButton } from '../WizardButton';
import { SuccessAnimation } from '../SuccessAnimation';
import type { VerificationSuccessData } from '@/types/wizard';
import type { WizardConfig } from '@/config/wizardConfig';

interface Step3SuccessProps {
  reportData: VerificationSuccessData | null;
  config: WizardConfig;
  onGoToNextStep: () => void;
}

export function Step3Success({ reportData, config, onGoToNextStep }: Step3SuccessProps) {
  // Auto-trigger next step event after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onGoToNextStep();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onGoToNextStep]);

  const successMessage = config.customSuccessMessage || 
    "Your credit report has been retrieved and uploaded to your file. You're all set!";

  return (
    <div className="animate-fade-in-up">
      <WizardCard>
        <WizardCardHeader>
          <SuccessAnimation className="mb-6" />
          <WizardCardTitle className="text-success">Success!</WizardCardTitle>
          <WizardCardDescription>
            {successMessage}
          </WizardCardDescription>
        </WizardCardHeader>

        <WizardCardBody>
          {/* Report Details */}
          {reportData && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Report Date:</span>
                <span className="font-medium text-foreground">{reportData.reportDate}</span>
              </div>
              
              {reportData.creditScore && (
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">TransUnion</p>
                    <p className="text-xl font-bold text-primary">{reportData.creditScore.transunion}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Experian</p>
                    <p className="text-xl font-bold text-primary">{reportData.creditScore.experian}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Equifax</p>
                    <p className="text-xl font-bold text-primary">{reportData.creditScore.equifax}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calendar placeholder or next steps */}
          {config.calendarId ? (
            <div className="bg-muted/20 rounded-lg p-6 text-center border border-dashed border-border">
              <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Calendar embed will appear here when integrated with GHL
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Calendar ID: {config.calendarId}
              </p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">
                Your credit repair journey is about to begin. Our team will review your report and reach out shortly.
              </p>
            </div>
          )}
        </WizardCardBody>

        <WizardCardFooter>
          <WizardButton
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={onGoToNextStep}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Continue
          </WizardButton>
        </WizardCardFooter>
      </WizardCard>
    </div>
  );
}
