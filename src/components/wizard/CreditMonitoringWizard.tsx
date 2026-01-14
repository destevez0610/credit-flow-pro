import { useCallback, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import { Step1ContactInfo } from './steps/Step1ContactInfo';
import { Step2Verification } from './steps/Step2Verification';
import { Step3Success } from './steps/Step3Success';
import { Step3Failure } from './steps/Step3Failure';
import { useWizardState } from '@/hooks/useWizardState';
import { useCredentialVerification } from '@/hooks/useCredentialVerification';
import { useGHLEvents } from '@/hooks/useGHLEvents';
import { defaultConfig, type WizardConfig } from '@/config/wizardConfig';
import type { ContactInfo, Credentials } from '@/types/wizard';

interface CreditMonitoringWizardProps {
  config?: Partial<WizardConfig>;
  initialContactInfo?: Partial<ContactInfo>;
}

export function CreditMonitoringWizard({ 
  config: configOverrides,
  initialContactInfo,
}: CreditMonitoringWizardProps) {
  // Merge config with defaults
  const config: WizardConfig = { ...defaultConfig, ...configOverrides };

  // State management
  const {
    state,
    setCurrentStep,
    updateContactInfo,
    setContactInfo,
    updateCredentials,
    setIsVerifying,
    setVerificationSuccess,
    setVerificationFailure,
    setVerificationError,
    clearError,
    resetToStep,
  } = useWizardState();

  // Credential verification hook
  const { verifyCredentials } = useCredentialVerification(config);

  // GHL events hook
  const { goToNextStep, requestContactData } = useGHLEvents({
    onContactDataReceived: (contact) => {
      // Pre-fill contact info from GHL
      setContactInfo({
        firstName: contact.firstName || state.contactInfo.firstName,
        lastName: contact.lastName || state.contactInfo.lastName,
        email: contact.email || state.contactInfo.email,
        phone: contact.phone || state.contactInfo.phone,
      });
    },
  });

  // Request contact data on mount
  useEffect(() => {
    requestContactData();
  }, [requestContactData]);

  // Pre-fill initial contact info if provided
  useEffect(() => {
    if (initialContactInfo) {
      setContactInfo({
        firstName: initialContactInfo.firstName || '',
        lastName: initialContactInfo.lastName || '',
        email: initialContactInfo.email || '',
        phone: initialContactInfo.phone || '',
      });
    }
  }, [initialContactInfo, setContactInfo]);

  // Handle step 1 -> step 2
  const handleContactInfoNext = useCallback(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  // Handle step 2 -> step 1
  const handleBackToContactInfo = useCallback(() => {
    clearError();
    setCurrentStep(1);
  }, [clearError, setCurrentStep]);

  // Handle verification
  const handleVerify = useCallback(async () => {
    setIsVerifying(true);
    clearError();

    try {
      const response = await verifyCredentials(state.contactInfo, state.credentials);

      if (response.success === true) {
        setVerificationSuccess(response.data);
      } else if (response.success === false) {
        const { error } = response;
        if (error.code === 'ACCOUNT_NOT_FOUND') {
          setVerificationFailure(error.code, error.userMessage);
        } else {
          setVerificationError(error.code, error.userMessage);
        }
      }
    } catch (error) {
      setVerificationError(
        'UNKNOWN_ERROR',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsVerifying(false);
    }
  }, [
    state.contactInfo,
    state.credentials,
    verifyCredentials,
    setIsVerifying,
    clearError,
    setVerificationSuccess,
    setVerificationFailure,
    setVerificationError,
  ]);

  // Handle retry from failure state
  const handleRetry = useCallback(() => {
    resetToStep(2);
  }, [resetToStep]);

  // Handle GHL next step trigger
  const handleGoToNextStep = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  // Render current step
  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <Step1ContactInfo
            contactInfo={state.contactInfo}
            onUpdateField={updateContactInfo}
            onNext={handleContactInfoNext}
          />
        );
      
      case 2:
        return (
          <Step2Verification
            credentials={state.credentials}
            onUpdateField={updateCredentials}
            onBack={handleBackToContactInfo}
            onVerify={handleVerify}
            isVerifying={state.isVerifying}
            errorMessage={state.verificationResult === 'error' ? state.errorMessage : undefined}
            errorCode={state.verificationResult === 'error' ? state.errorCode : undefined}
          />
        );
      
      case 3:
        if (state.verificationResult === 'success') {
          return (
            <Step3Success
              reportData={state.reportData}
              config={config}
              onGoToNextStep={handleGoToNextStep}
            />
          );
        } else {
          return (
            <Step3Failure
              errorMessage={state.errorMessage}
              errorCode={state.errorCode}
              config={config}
              onRetry={handleRetry}
            />
          );
        }
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-gradient">Credit Monitoring Wizard</span>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={state.currentStep} totalSteps={3} />

      {/* Step content */}
      <div className="flex-1">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs text-muted-foreground">
        <p>Powered by CROs GHL Tool Box</p>
        <p className="mt-1">Your data is encrypted and secure 🔒</p>
      </div>
    </div>
  );
}
