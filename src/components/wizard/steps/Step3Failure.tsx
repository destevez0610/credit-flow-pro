import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { WizardCard, WizardCardHeader, WizardCardTitle, WizardCardDescription, WizardCardBody, WizardCardFooter } from '../WizardCard';
import { WizardButton } from '../WizardButton';
import type { WizardConfig } from '@/config/wizardConfig';

interface Step3FailureProps {
  errorMessage: string;
  errorCode: string;
  config: WizardConfig;
  onRetry: () => void;
}

export function Step3Failure({ errorMessage, errorCode, config, onRetry }: Step3FailureProps) {
  const failureMessage = config.customFailureMessage || 
    "We couldn't find an active credit monitoring account. You'll need to activate monitoring to proceed.";

  const handleActivateClick = () => {
    window.open(config.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="animate-fade-in-up">
      <WizardCard>
        <WizardCardHeader>
          {/* Alert icon */}
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/10 border-2 border-destructive/30">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          
          <WizardCardTitle className="text-destructive">
            {errorCode === 'ACCOUNT_NOT_FOUND' ? 'No Active Monitoring Found' : 'Verification Failed'}
          </WizardCardTitle>
          
          <WizardCardDescription>
            {failureMessage}
          </WizardCardDescription>
        </WizardCardHeader>

        <WizardCardBody>
          {/* Error details */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              {errorMessage}
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-foreground">What to do next:</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Click the button below to sign up for credit monitoring</li>
              <li>Complete the enrollment process on SmartCredit</li>
              <li>Return here and click "Check Again" to verify your account</li>
            </ol>
          </div>
        </WizardCardBody>

        <WizardCardFooter>
          <WizardButton
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleActivateClick}
            icon={<ExternalLink className="h-5 w-5" />}
          >
            Activate Monitoring Now
          </WizardButton>

          <WizardButton
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={onRetry}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            I just signed up, check again
          </WizardButton>

          {config.supportEmail && (
            <p className="text-center text-xs text-muted-foreground">
              Need help? Contact{' '}
              <a 
                href={`mailto:${config.supportEmail}`}
                className="text-primary hover:underline"
              >
                {config.supportEmail}
              </a>
            </p>
          )}
        </WizardCardFooter>
      </WizardCard>
    </div>
  );
}
