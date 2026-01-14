import { useState } from 'react';
import { Settings, Save, Eye, EyeOff, TestTube, Link, Calendar, Mail, Palette, DollarSign } from 'lucide-react';
import { WizardCard, WizardCardHeader, WizardCardTitle, WizardCardBody } from './WizardCard';
import { WizardInput } from './WizardInput';
import { WizardButton } from './WizardButton';
import { WizardSelect } from './WizardSelect';
import { WizardAlert } from './WizardAlert';
import type { WizardConfig } from '@/config/wizardConfig';

interface SettingsPanelProps {
  config: WizardConfig;
  onSave: (config: WizardConfig) => void;
}

const billingModelOptions = [
  { value: 'client_pay', label: 'Client Pay' },
  { value: 'agency_pay', label: 'Agency Pay' },
  { value: 'hybrid', label: 'Hybrid' },
];

export function SettingsPanel({ config, onSave }: SettingsPanelProps) {
  const [localConfig, setLocalConfig] = useState<WizardConfig>(config);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateConfig = <K extends keyof WizardConfig>(key: K, value: WizardConfig[K]) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-gradient">Widget Configuration</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure your Credit Monitoring Wizard settings
        </p>
      </div>

      <div className="space-y-6 flex-1">
        {/* API & Webhook Settings */}
        <WizardCard>
          <WizardCardHeader className="text-left mb-4">
            <div className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              <WizardCardTitle className="text-lg">API Configuration</WizardCardTitle>
            </div>
          </WizardCardHeader>
          <WizardCardBody>
            <WizardInput
              label="Webhook URL"
              placeholder="https://your-backend.com/api/verify"
              value={localConfig.webhookUrl}
              onChange={(e) => updateConfig('webhookUrl', e.target.value)}
            />
            <div className="relative">
              <WizardInput
                label="GHL API Key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="Enter your GoHighLevel API key"
                value={localConfig.ghlApiKey}
                onChange={(e) => updateConfig('ghlApiKey', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </WizardCardBody>
        </WizardCard>

        {/* Affiliate & Calendar Settings */}
        <WizardCard>
          <WizardCardHeader className="text-left mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <WizardCardTitle className="text-lg">Integration Settings</WizardCardTitle>
            </div>
          </WizardCardHeader>
          <WizardCardBody>
            <WizardInput
              label="Affiliate Link"
              placeholder="https://www.smartcredit.com/join?ref=your-id"
              value={localConfig.affiliateLink}
              onChange={(e) => updateConfig('affiliateLink', e.target.value)}
            />
            <WizardInput
              label="Calendar ID (Optional)"
              placeholder="Enter GHL calendar ID for booking embed"
              value={localConfig.calendarId}
              onChange={(e) => updateConfig('calendarId', e.target.value)}
            />
          </WizardCardBody>
        </WizardCard>

        {/* Billing Model */}
        <WizardCard>
          <WizardCardHeader className="text-left mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <WizardCardTitle className="text-lg">Billing Configuration</WizardCardTitle>
            </div>
          </WizardCardHeader>
          <WizardCardBody>
            <WizardSelect
              label="Billing Model"
              options={billingModelOptions}
              value={localConfig.billingModel}
              onChange={(value) => updateConfig('billingModel', value as WizardConfig['billingModel'])}
            />
          </WizardCardBody>
        </WizardCard>

        {/* Branding Settings */}
        <WizardCard>
          <WizardCardHeader className="text-left mb-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <WizardCardTitle className="text-lg">Branding</WizardCardTitle>
            </div>
          </WizardCardHeader>
          <WizardCardBody>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <WizardInput
                  label="Brand Color"
                  type="text"
                  placeholder="#2563EB"
                  value={localConfig.brandColor}
                  onChange={(e) => updateConfig('brandColor', e.target.value)}
                />
              </div>
              <div
                className="h-10 w-10 rounded-lg border border-border flex-shrink-0"
                style={{ backgroundColor: localConfig.brandColor }}
              />
            </div>
            <WizardInput
              label="Support Email"
              type="email"
              placeholder="support@youragency.com"
              value={localConfig.supportEmail}
              onChange={(e) => updateConfig('supportEmail', e.target.value)}
            />
          </WizardCardBody>
        </WizardCard>

        {/* Custom Messages */}
        <WizardCard>
          <WizardCardHeader className="text-left mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <WizardCardTitle className="text-lg">Custom Messages</WizardCardTitle>
            </div>
          </WizardCardHeader>
          <WizardCardBody>
            <WizardInput
              label="Custom Success Message (Optional)"
              placeholder="Leave blank for default message"
              value={localConfig.customSuccessMessage}
              onChange={(e) => updateConfig('customSuccessMessage', e.target.value)}
            />
            <WizardInput
              label="Custom Failure Message (Optional)"
              placeholder="Leave blank for default message"
              value={localConfig.customFailureMessage}
              onChange={(e) => updateConfig('customFailureMessage', e.target.value)}
            />
          </WizardCardBody>
        </WizardCard>

        {/* Developer Settings */}
        <WizardCard>
          <WizardCardHeader className="text-left mb-4">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              <WizardCardTitle className="text-lg">Developer Settings</WizardCardTitle>
            </div>
          </WizardCardHeader>
          <WizardCardBody>
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Mock Mode</p>
                <p className="text-xs text-muted-foreground">
                  Enable for testing without real API calls
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateConfig('enableMockMode', !localConfig.enableMockMode)}
                className={`
                  relative w-12 h-6 rounded-full transition-colors duration-200
                  ${localConfig.enableMockMode ? 'bg-primary' : 'bg-muted'}
                `}
              >
                <span
                  className={`
                    absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                    ${localConfig.enableMockMode ? 'translate-x-7' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {localConfig.enableMockMode && (
              <WizardAlert variant="info">
                <p className="text-sm">
                  <strong>Mock Mode Active:</strong> Use password "12345" for success, 
                  "67890" for inactive account, any other for invalid credentials.
                </p>
              </WizardAlert>
            )}
          </WizardCardBody>
        </WizardCard>
      </div>

      {/* Save Button */}
      <div className="mt-8 space-y-3">
        {saved && (
          <WizardAlert variant="success">
            Settings saved successfully!
          </WizardAlert>
        )}
        <WizardButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
        >
          <Save className="h-5 w-5 mr-2" />
          Save Configuration
        </WizardButton>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-xs text-muted-foreground">
        <p>Powered by CROs GHL Tool Box</p>
      </div>
    </div>
  );
}