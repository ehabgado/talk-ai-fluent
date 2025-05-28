
import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LandingPage from '@/components/LandingPage';
import LoginPage from '@/components/auth/LoginPage';
import SignupPage from '@/components/auth/SignupPage';
import PhaseNavigation from '@/components/PhaseNavigation';
import PreSessionPlanning from '@/components/phases/PreSessionPlanning';
import LivePresentation from '@/components/phases/LivePresentation';
import PostAnalysis from '@/components/phases/PostAnalysis';

export type Phase = 'landing' | 'login' | 'signup' | 'phase1' | 'phase2' | 'phase3';

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (email: string, password: string) => {
    // In production, this would authenticate with Supabase
    setUser({ name: email.split('@')[0], email });
    setIsAuthenticated(true);
    setCurrentPhase('phase1');
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // In production, this would create user with Supabase
    setUser({ name, email });
    setIsAuthenticated(true);
    setCurrentPhase('phase1');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPhase('landing');
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentPhase('login')} />;
      case 'login':
        return (
          <LoginPage
            onBack={() => setCurrentPhase('landing')}
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentPhase('signup')}
          />
        );
      case 'signup':
        return (
          <SignupPage
            onBack={() => setCurrentPhase('landing')}
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentPhase('login')}
          />
        );
      case 'phase1':
        return <PreSessionPlanning onNext={() => setCurrentPhase('phase2')} onBack={() => setCurrentPhase('landing')} />;
      case 'phase2':
        return <LivePresentation onNext={() => setCurrentPhase('phase3')} onBack={() => setCurrentPhase('phase1')} />;
      case 'phase3':
        return <PostAnalysis onRestart={() => setCurrentPhase('landing')} onBack={() => setCurrentPhase('phase2')} />;
      default:
        return <LandingPage onStart={() => setCurrentPhase('login')} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {isAuthenticated && currentPhase !== 'landing' && currentPhase !== 'login' && currentPhase !== 'signup' && (
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
