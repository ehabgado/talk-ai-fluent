
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, Brain, TrendingUp, Globe } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  const { language, setLanguage, t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {language === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>

      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('app.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            {t('app.subtitle')}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {t('app.description')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in delay-300">
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('phase.planning')}</h3>
              <p className="text-gray-600 text-sm">AI-powered content structuring</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <Mic className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('phase.live')}</h3>
              <p className="text-gray-600 text-sm">Real-time delivery assistance</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('phase.analysis')}</h3>
              <p className="text-gray-600 text-sm">Performance tracking & improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-500"
        >
          {t('button.getStarted')}
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
