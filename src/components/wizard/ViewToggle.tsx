import { Settings, Wand2 } from 'lucide-react';

export type ViewMode = 'wizard' | 'settings';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="w-full bg-wizard-dark border-b border-wizard-border">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center py-3">
          <div className="inline-flex rounded-lg bg-wizard-card border border-wizard-border p-1">
            <button
              onClick={() => onViewChange('wizard')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${currentView === 'wizard' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-wizard-dark/50'
                }
              `}
            >
              <Wand2 className="h-4 w-4" />
              Wizard
            </button>
            <button
              onClick={() => onViewChange('settings')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${currentView === 'settings' 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-wizard-dark/50'
                }
              `}
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}