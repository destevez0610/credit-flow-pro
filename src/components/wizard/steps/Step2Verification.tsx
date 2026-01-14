import { useState, useEffect } from 'react';
import { Shield, User, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { WizardCard, WizardCardHeader, WizardCardTitle, WizardCardDescription, WizardCardBody, WizardCardFooter } from '../WizardCard';
import { WizardInput } from '../WizardInput';
import { WizardSelect } from '../WizardSelect';
import { WizardButton } from '../WizardButton';
import { WizardAlert } from '../WizardAlert';
import { useFormValidation } from '@/hooks/useFormValidation';
import { providers } from '@/config/wizardConfig';
import type { Credentials, FormValidationErrors } from '@/types/wizard';

interface Step2VerificationProps {
  credentials: Credentials;
  onUpdateField: (field: keyof Credentials, value: string) => void;
  onBack: () => void;
  onVerify: () => void;
  isVerifying: boolean;
  errorMessage?: string;
  errorCode?: string;
}

export function Step2Verification({
  credentials,
  onUpdateField,
  onBack,
  onVerify,
  isVerifying,
  errorMessage,
  errorCode,
}: Step2VerificationProps) {
  const { validateCredentials } = useFormValidation();
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate on change when field has been touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: validationErrors } = validateCredentials(credentials);
      const touchedErrors: FormValidationErrors = {};
      Object.keys(touched).forEach(field => {
        if (validationErrors[field as keyof FormValidationErrors]) {
          touchedErrors[field as keyof FormValidationErrors] = validationErrors[field as keyof FormValidationErrors];
        }
      });
      setErrors(touchedErrors);
    }
  }, [credentials, touched, validateCredentials]);

  const handleBlur = (field: keyof Credentials) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateCredentials(credentials);
    
    if (isValid) {
      onVerify();
    } else {
      setErrors(validationErrors);
      setTouched({
        username: true,
        password: true,
      });
    }
  };

  const { isValid } = validateCredentials(credentials);

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up">
      <WizardCard>
        <WizardCardHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <WizardCardTitle>Verify Your Account</WizardCardTitle>
          <WizardCardDescription>
            Enter your credit monitoring login credentials to retrieve your report.
          </WizardCardDescription>
        </WizardCardHeader>

        <WizardCardBody>
          {/* Error Alert */}
          {errorMessage && (
            <WizardAlert
              variant={errorCode === 'INVALID_CREDENTIALS' ? 'warning' : 'error'}
              title={errorCode === 'INVALID_CREDENTIALS' ? 'Invalid Credentials' : 'Verification Failed'}
            >
              {errorMessage}
            </WizardAlert>
          )}

          <WizardSelect
            label="Credit Monitoring Provider"
            options={providers}
            value={credentials.provider}
            onChange={(value) => onUpdateField('provider', value)}
            required
          />

          <WizardInput
            label="Username / Email"
            placeholder="Enter your login username or email"
            icon={User}
            value={credentials.username}
            onChange={(e) => onUpdateField('username', e.target.value)}
            onBlur={() => handleBlur('username')}
            error={errors.username}
            required
            autoComplete="username"
          />

          <WizardInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            value={credentials.password}
            onChange={(e) => onUpdateField('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          {/* Mock mode hint */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded-lg">
            <p className="font-medium text-accent mb-1">🧪 Mock Mode Active</p>
            <p>Use password <code className="font-mono bg-muted px-1 rounded">12345</code> for success, <code className="font-mono bg-muted px-1 rounded">67890</code> for inactive account</p>
          </div>
        </WizardCardBody>

        <WizardCardFooter>
          <WizardButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isVerifying}
            disabled={!isValid}
            icon={<CheckCircle className="h-5 w-5" />}
          >
            Verify Account
          </WizardButton>

          <WizardButton
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={onBack}
            disabled={isVerifying}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Contact Info
          </WizardButton>
        </WizardCardFooter>
      </WizardCard>
    </form>
  );
}
