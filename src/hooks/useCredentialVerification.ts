import { useCallback } from 'react';
import type { ContactInfo, Credentials, VerificationResponse } from '@/types/wizard';
import { mockResponses, type WizardConfig } from '@/config/wizardConfig';

interface VerificationPayload {
  contactInfo: ContactInfo;
  credentials: Credentials;
  metadata: {
    ghlContactId?: string;
    ghlLocationId?: string;
    funnel?: string;
    userAgent: string;
    timestamp: string;
  };
}

export function useCredentialVerification(config: WizardConfig) {
  const verifyCredentials = useCallback(
    async (contactInfo: ContactInfo, credentials: Credentials): Promise<VerificationResponse> => {
      // If mock mode is enabled, use mock responses
      if (config.enableMockMode) {
        return simulateMockVerification(credentials.password);
      }

      // Real API call to webhook
      const payload: VerificationPayload = {
        contactInfo,
        credentials: {
          ...credentials,
          // Note: In production, encrypt password before sending
          password: credentials.password,
        },
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(config.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            error: {
              code: errorData.error?.code || 'API_ERROR',
              message: errorData.error?.message || 'API request failed',
              userMessage: errorData.error?.userMessage || 'Something went wrong. Please try again.',
              retryable: true,
            },
          };
        }

        const data = await response.json();
        return data as VerificationResponse;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return {
            success: false,
            error: {
              code: 'TIMEOUT',
              message: 'Request timed out',
              userMessage: 'The request took too long. Please try again.',
              retryable: true,
            },
          };
        }

        // Network error - attempt one retry
        try {
          const retryResponse = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return data as VerificationResponse;
          }
        } catch {
          // Retry also failed
        }

        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'Network request failed',
            userMessage: "We're experiencing technical difficulties. Please check your connection and try again.",
            retryable: true,
            supportEmail: config.supportEmail,
          },
        };
      }
    },
    [config]
  );

  return { verifyCredentials };
}

// Mock verification for development/testing
async function simulateMockVerification(password: string): Promise<VerificationResponse> {
  // Simulate network delay (1-2 seconds)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Mock responses based on password
  if (password === '12345') {
    return mockResponses.success;
  } else if (password === '67890') {
    return mockResponses.inactive;
  } else {
    return mockResponses.invalidCredentials;
  }
}
