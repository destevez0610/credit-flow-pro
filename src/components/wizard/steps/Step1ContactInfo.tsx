import { useState, useEffect } from 'react';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import { WizardCard, WizardCardHeader, WizardCardTitle, WizardCardDescription, WizardCardBody, WizardCardFooter } from '../WizardCard';
import { WizardInput } from '../WizardInput';
import { WizardButton } from '../WizardButton';
import { useFormValidation } from '@/hooks/useFormValidation';
import type { ContactInfo, FormValidationErrors } from '@/types/wizard';

interface Step1ContactInfoProps {
  contactInfo: ContactInfo;
  onUpdateField: (field: keyof ContactInfo, value: string) => void;
  onNext: () => void;
}

export function Step1ContactInfo({ contactInfo, onUpdateField, onNext }: Step1ContactInfoProps) {
  const { validateContactInfo, formatPhoneNumber } = useFormValidation();
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate on change when field has been touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: validationErrors } = validateContactInfo(contactInfo);
      // Only show errors for touched fields
      const touchedErrors: FormValidationErrors = {};
      Object.keys(touched).forEach(field => {
        if (validationErrors[field as keyof FormValidationErrors]) {
          touchedErrors[field as keyof FormValidationErrors] = validationErrors[field as keyof FormValidationErrors];
        }
      });
      setErrors(touchedErrors);
    }
  }, [contactInfo, touched, validateContactInfo]);

  const handleBlur = (field: keyof ContactInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    onUpdateField('phone', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateContactInfo(contactInfo);
    
    if (isValid) {
      onNext();
    } else {
      setErrors(validationErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      });
    }
  };

  const { isValid } = validateContactInfo(contactInfo);

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up">
      <WizardCard>
        <WizardCardHeader>
          <WizardCardTitle>Let's Get Started</WizardCardTitle>
          <WizardCardDescription>
            Enter your contact information to continue with credit monitoring verification.
          </WizardCardDescription>
        </WizardCardHeader>

        <WizardCardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WizardInput
              label="First Name"
              placeholder="John"
              icon={User}
              value={contactInfo.firstName}
              onChange={(e) => onUpdateField('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              error={errors.firstName}
              required
              autoComplete="given-name"
            />
            
            <WizardInput
              label="Last Name"
              placeholder="Doe"
              icon={User}
              value={contactInfo.lastName}
              onChange={(e) => onUpdateField('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              error={errors.lastName}
              required
              autoComplete="family-name"
            />
          </div>

          <WizardInput
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon={Mail}
            value={contactInfo.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            required
            autoComplete="email"
          />

          <WizardInput
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            icon={Phone}
            value={contactInfo.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={() => handleBlur('phone')}
            error={errors.phone}
            required
            autoComplete="tel"
          />
        </WizardCardBody>

        <WizardCardFooter>
          <WizardButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid}
            icon={<ArrowRight className="h-5 w-5" />}
          >
            Next Step
          </WizardButton>
        </WizardCardFooter>
      </WizardCard>
    </form>
  );
}
