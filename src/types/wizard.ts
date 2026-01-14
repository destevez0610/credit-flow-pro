// Type definitions for the Credit Monitoring Wizard

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Credentials {
  provider: string;
  username: string;
  password: string;
}

export interface CreditScore {
  transunion: number;
  experian: number;
  equifax: number;
}

export interface VerificationSuccessData {
  accountActive: boolean;
  reportRetrieved: boolean;
  reportUrl: string;
  reportDate: string;
  creditScore?: CreditScore;
  subscriptionExpires?: string;
}

export interface VerificationError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  supportEmail?: string;
}

export interface VerificationSuccessResponse {
  success: true;
  data: VerificationSuccessData;
  message: string;
}

export interface VerificationErrorResponse {
  success: false;
  error: VerificationError;
}

export type VerificationResponse = VerificationSuccessResponse | VerificationErrorResponse;

export type WizardStep = 1 | 2 | 3;

export type VerificationResult = 'success' | 'failure' | 'error' | null;

export interface WizardState {
  currentStep: WizardStep;
  contactInfo: ContactInfo;
  credentials: Credentials;
  isLoading: boolean;
  isVerifying: boolean;
  showPassword: boolean;
  verificationResult: VerificationResult;
  errorMessage: string;
  errorCode: string;
  reportData: VerificationSuccessData | null;
}

export interface FormValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
}
