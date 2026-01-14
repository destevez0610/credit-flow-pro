import { useMemo } from 'react';
import type { ContactInfo, Credentials, FormValidationErrors } from '@/types/wizard';

// Validation patterns
const patterns = {
  name: /^[a-zA-Z\s\-']+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
};

export function useFormValidation() {
  const validateContactInfo = useMemo(() => {
    return (contactInfo: ContactInfo): { isValid: boolean; errors: FormValidationErrors } => {
      const errors: FormValidationErrors = {};
      
      // First name validation
      if (!contactInfo.firstName.trim()) {
        errors.firstName = 'First name is required';
      } else if (contactInfo.firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
      } else if (!patterns.name.test(contactInfo.firstName)) {
        errors.firstName = 'First name can only contain letters';
      }
      
      // Last name validation
      if (!contactInfo.lastName.trim()) {
        errors.lastName = 'Last name is required';
      } else if (contactInfo.lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
      } else if (!patterns.name.test(contactInfo.lastName)) {
        errors.lastName = 'Last name can only contain letters';
      }
      
      // Email validation
      if (!contactInfo.email.trim()) {
        errors.email = 'Email is required';
      } else if (!patterns.email.test(contactInfo.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      // Phone validation
      if (!contactInfo.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!patterns.phone.test(contactInfo.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    };
  }, []);

  const validateCredentials = useMemo(() => {
    return (credentials: Credentials): { isValid: boolean; errors: FormValidationErrors } => {
      const errors: FormValidationErrors = {};
      
      // Username validation
      if (!credentials.username.trim()) {
        errors.username = 'Username is required';
      } else if (credentials.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters';
      }
      
      // Password validation
      if (!credentials.password) {
        errors.password = 'Password is required';
      } else if (credentials.password.length < 4) {
        errors.password = 'Password must be at least 4 characters';
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    };
  }, []);

  // Format phone number as user types
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  return {
    validateContactInfo,
    validateCredentials,
    formatPhoneNumber,
  };
}
