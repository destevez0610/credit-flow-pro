import { useEffect, useCallback } from 'react';
import type { ContactInfo } from '@/types/wizard';

interface GHLContactData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

interface UseGHLEventsOptions {
  onContactDataReceived?: (contact: ContactInfo) => void;
}

export function useGHLEvents(options: UseGHLEventsOptions = {}) {
  const { onContactDataReceived } = options;

  // Send resize message to parent iframe
  const sendResizeMessage = useCallback(() => {
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage(
      {
        type: 'resize',
        height: height + 20, // Add small buffer
      },
      '*'
    );
  }, []);

  // Request contact data from GHL parent
  const requestContactData = useCallback(() => {
    window.parent.postMessage(
      {
        type: 'request_contact_data',
      },
      '*'
    );
  }, []);

  // Fire the go to next step event for GHL funnel progression
  const goToNextStep = useCallback(() => {
    // Dispatch custom event for GHL
    window.dispatchEvent(new Event('customWidgetGoToNextStep'));
    
    // Also try postMessage for iframe scenarios
    window.parent.postMessage(
      {
        type: 'customWidgetGoToNextStep',
      },
      '*'
    );
  }, []);

  // Listen for messages from GHL parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      switch (event.data.type) {
        case 'ghl_contact_data': {
          const contact = event.data.contact as GHLContactData;
          if (contact && onContactDataReceived) {
            onContactDataReceived({
              firstName: contact.firstName || '',
              lastName: contact.lastName || '',
              email: contact.email || '',
              phone: contact.phone || '',
            });
          }
          break;
        }
        
        case 'ghl_config': {
          // Handle configuration updates from GHL
          console.log('Received GHL config:', event.data.config);
          break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onContactDataReceived]);

  // Send resize on mount and when content changes
  useEffect(() => {
    sendResizeMessage();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      sendResizeMessage();
    });
    
    resizeObserver.observe(document.body);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [sendResizeMessage]);

  return {
    sendResizeMessage,
    requestContactData,
    goToNextStep,
  };
}
