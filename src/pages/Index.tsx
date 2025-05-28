
import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LandingPage from '@/components/LandingPage';
import PhaseNavigation from '@/components/PhaseNavigation';
import PreSessionPlanning from '@/components/phases/PreSessionPlanning';
import LivePresentation from '@/components/phases/LivePresentation';
import PostAnalysis from '@/components/phases/PostAnalysis';

export type Phase = 'landing' | 'phase1' | 'phase2' | 'phase3';

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('landing');

  const renderPhase = () => {
    switch (currentPhase) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentPhase('phase1')} />;
      case 'phase1':
        return <PreSessionPlanning onNext={() => setCurrentPhase('phase2')} onBack={() => setCurrentPhase('landing')} />;
      case 'phase2':
        return <LivePresentation onNext={() => setCurrentPhase('phase3')} onBack={() => setCurrentPhase('phase1')} />;
      case 'phase3':
        return <PostAnalysis onRestart={() => setCurrentPhase('landing')} onBack={() => setCurrentPhase('phase2')} />;
      default:
        return <LandingPage onStart={() => setCurrentPhase('phase1')} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {currentPhase !== 'landing' && (
          <PhaseNavigation 
            currentPhase={currentPhase} 
            onPhaseChange={setCurrentPhase} 
          />
        )}
        {renderPhase()}
      </div>
    </LanguageProvider>
  );
};

export default Index;
