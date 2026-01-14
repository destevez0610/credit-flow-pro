import { CreditMonitoringWizard } from '@/components/wizard/CreditMonitoringWizard';

const Index = () => {
  return (
    <div className="min-h-screen bg-wizard-dark">
      <CreditMonitoringWizard 
        config={{
          enableMockMode: true,
          affiliateLink: 'https://www.smartcredit.com/join',
          billingModel: 'client_pay',
        }}
      />
    </div>
  );
};

export default Index;
