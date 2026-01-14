import { useState, useCallback } from 'react';
import type { 
  WizardState, 
  ContactInfo, 
  Credentials, 
  VerificationResult,
  VerificationSuccessData,
  WizardStep 
} from '@/types/wizard';

const initialContactInfo: ContactInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const initialCredentials: Credentials = {
  provider: 'smartcredit',
  username: '',
  password: '',
};

const initialState: WizardState = {
  currentStep: 1,
  contactInfo: initialContactInfo,
  credentials: initialCredentials,
  isLoading: false,
  isVerifying: false,
  showPassword: false,
  verificationResult: null,
  errorMessage: '',
  errorCode: '',
  reportData: null,
};

export function useWizardState() {
  const [state, setState] = useState<WizardState>(initialState);

  const setCurrentStep = useCallback((step: WizardStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const updateContactInfo = useCallback((field: keyof ContactInfo, value: string) => {
    setState(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  }, []);

  const setContactInfo = useCallback((info: ContactInfo) => {
    setState(prev => ({ ...prev, contactInfo: info }));
  }, []);

  const updateCredentials = useCallback((field: keyof Credentials, value: string) => {
    setState(prev => ({
      ...prev,
      credentials: { ...prev.credentials, [field]: value },
    }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setIsVerifying = useCallback((verifying: boolean) => {
    setState(prev => ({ ...prev, isVerifying: verifying }));
  }, []);

  const toggleShowPassword = useCallback(() => {
    setState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const setVerificationSuccess = useCallback((data: VerificationSuccessData) => {
    setState(prev => ({
      ...prev,
      verificationResult: 'success',
      reportData: data,
      errorMessage: '',
      errorCode: '',
      currentStep: 3,
    }));
  }, []);

  const setVerificationFailure = useCallback((errorCode: string, errorMessage: string) => {
    setState(prev => ({
      ...prev,
      verificationResult: 'failure',
      errorCode,
      errorMessage,
      currentStep: 3,
    }));
  }, []);

  const setVerificationError = useCallback((errorCode: string, errorMessage: string) => {
    setState(prev => ({
      ...prev,
      verificationResult: 'error',
      errorCode,
      errorMessage,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      verificationResult: null,
      errorMessage: '',
      errorCode: '',
    }));
  }, []);

  const resetToStep = useCallback((step: WizardStep) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
      verificationResult: null,
      errorMessage: '',
      errorCode: '',
      isVerifying: false,
    }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    setCurrentStep,
    updateContactInfo,
    setContactInfo,
    updateCredentials,
    setIsLoading,
    setIsVerifying,
    toggleShowPassword,
    setVerificationSuccess,
    setVerificationFailure,
    setVerificationError,
    clearError,
    resetToStep,
    resetWizard,
  };
}
