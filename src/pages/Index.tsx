import { useState } from 'react';
import { CreditMonitoringWizard } from '@/components/wizard/CreditMonitoringWizard';
import { SettingsPanel } from '@/components/wizard/SettingsPanel';
import { ViewToggle, type ViewMode } from '@/components/wizard/ViewToggle';
import { defaultConfig, type WizardConfig } from '@/config/wizardConfig';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('wizard');
  const [config, setConfig] = useState<WizardConfig>({
    ...defaultConfig,
    enableMockMode: true,
    affiliateLink: 'https://www.smartcredit.com/join',
    billingModel: 'client_pay',
  });

  const handleSaveConfig = (newConfig: WizardConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-wizard-dark">
      <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'wizard' ? (
        <CreditMonitoringWizard config={config} />
      ) : (
        <SettingsPanel config={config} onSave={handleSaveConfig} />
      )}
    </div>
  );
};

export default Index;
