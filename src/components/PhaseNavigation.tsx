
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Mic, TrendingUp, Globe } from 'lucide-react';
import { Phase } from '@/pages/Index';

interface PhaseNavigationProps {
  currentPhase: Phase;
  onPhaseChange: (phase: Phase) => void;
}

const PhaseNavigation = ({ currentPhase, onPhaseChange }: PhaseNavigationProps) => {
  const { language, setLanguage, t } = useLanguage();

  const phases = [
    { id: 'phase1' as Phase, icon: Brain, label: t('phase.planning') },
    { id: 'phase2' as Phase, icon: Mic, label: t('phase.live') },
    { id: 'phase3' as Phase, icon: TrendingUp, label: t('phase.analysis') },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VA</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{t('app.title')}</span>
        </div>

        {/* Phase Navigation */}
        <div className="flex items-center gap-2">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = currentPhase === phase.id;
            const isCompleted = phases.findIndex(p => p.id === currentPhase) > index;
            
            return (
              <div key={phase.id} className="flex items-center">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPhaseChange(phase.id)}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : isCompleted 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{phase.label}</span>
                </Button>
                {index < phases.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Language Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {language === 'ar' ? 'EN' : 'ع'}
        </Button>
      </div>
    </div>
  );
};

export default PhaseNavigation;
