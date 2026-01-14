// Credit Monitoring Wizard Configuration Schema & Defaults

export interface WizardConfig {
  // Required settings
  webhookUrl: string;
  ghlApiKey: string;
  
  // Optional settings
  affiliateLink: string;
  calendarId: string;
  billingModel: 'client_pay' | 'agency_pay' | 'hybrid';
  enableMockMode: boolean;
  customSuccessMessage: string;
  customFailureMessage: string;
  brandColor: string;
  supportEmail: string;
}

export const defaultConfig: WizardConfig = {
  webhookUrl: '',
  ghlApiKey: '',
  affiliateLink: 'https://www.smartcredit.com/join',
  calendarId: '',
  billingModel: 'client_pay',
  enableMockMode: true, // Default to true for development
  customSuccessMessage: '',
  customFailureMessage: '',
  brandColor: '#2563EB',
  supportEmail: 'support@youragency.com',
};

// Credit monitoring providers
export const providers = [
  { value: 'smartcredit', label: 'SmartCredit' },
  { value: 'privacyguard', label: 'PrivacyGuard' },
  { value: 'identityiq', label: 'IdentityIQ' },
  { value: 'myscoreiq', label: 'MyScoreIQ' },
] as const;

export type Provider = typeof providers[number]['value'];

// Mock responses for testing
export const mockResponses = {
  // Password "12345" = success
  success: {
    success: true as const,
    data: {
      accountActive: true,
      reportRetrieved: true,
      reportUrl: 'https://storage.example.com/reports/sample.pdf',
      reportDate: new Date().toISOString().split('T')[0],
      creditScore: {
        transunion: 720,
        experian: 715,
        equifax: 718,
      },
      subscriptionExpires: '2027-01-13',
    },
    message: 'Credit report successfully retrieved and uploaded.',
  },
  
  // Password "67890" = inactive account
  inactive: {
    success: false as const,
    error: {
      code: 'ACCOUNT_NOT_FOUND',
      message: 'No active credit monitoring account found with these credentials.',
      userMessage: "We couldn't find an active account. Please check your credentials or sign up for monitoring.",
      retryable: true,
    },
  },
  
  // Any other password = invalid credentials
  invalidCredentials: {
    success: false as const,
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Username or password is incorrect.',
      userMessage: 'The credentials you entered are incorrect. Please try again.',
      retryable: true,
    },
  },
};
