
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, Brain, TrendingUp, Globe, Play, Star, Users, Award, Zap, Target, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="outline"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <Globe className="w-4 h-4" />
          {language === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>

      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{
            left: `${20 + mousePosition.x * 0.02}%`,
            top: `${10 + mousePosition.y * 0.02}%`,
            transform: 'translate3d(0,0,0)',
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-teal-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"
          style={{
            right: `${10 - mousePosition.x * 0.01}%`,
            bottom: `${20 - mousePosition.y * 0.01}%`,
            transform: 'translate3d(0,0,0)',
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 bg-gradient-to-r from-pink-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"
          style={{
            left: `${60 + mousePosition.x * 0.015}%`,
            top: `${60 + mousePosition.y * 0.015}%`,
            transform: 'translate3d(0,0,0)',
          }}
        ></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in">
          <div className="mb-8 relative">
            <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6 animate-pulse">
              Voca AI
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full animate-pulse"></div>
          </div>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
            Master Your Presentation Skills with AI
          </p>
          <p className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your presentations with real-time AI coaching, intelligent structuring, and performance analytics. 
            Speak with confidence, deliver with impact.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-white/80">Improvement Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-purple-400 mb-2">Real-time</div>
              <div className="text-white/80">AI Feedback</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl font-bold text-pink-400 mb-2">Multi-lang</div>
              <div className="text-white/80">Support</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in delay-300">
          <Card className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:rotate-1 group">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <Brain className="w-16 h-16 text-blue-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Planning</h3>
              <p className="text-white/70 leading-relaxed">
                Upload any file format and let AI structure your presentation for maximum impact
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white/60">PDF, DOCX, PPT supported</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-rotate-1 group">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <Mic className="w-16 h-16 text-green-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-green-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Live Coaching</h3>
              <p className="text-white/70 leading-relaxed">
                Real-time feedback on pace, structure, and delivery to elevate your performance
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white/60">Instant feedback</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:rotate-1 group">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <TrendingUp className="w-16 h-16 text-purple-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Analytics</h3>
              <p className="text-white/70 leading-relaxed">
                Track progress, identify patterns, and continuously improve your speaking skills
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/60">Goal tracking</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mb-16 animate-fade-in delay-500">
          <h2 className="text-4xl font-bold text-white mb-12">Why Choose Voca AI?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <Star className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Professional Results</h3>
                  <p className="text-white/70 leading-relaxed">
                    Transform nervous speakers into confident presenters with AI-driven insights and personalized coaching
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <Users className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Multilingual Support</h3>
                  <p className="text-white/70 leading-relaxed">
                    Practice in Arabic or English with full RTL support and culturally-aware AI feedback
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Smart Analytics</h3>
                  <p className="text-white/70 leading-relaxed">
                    Detailed performance metrics help you understand your strengths and areas for improvement
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Instant Feedback</h3>
                  <p className="text-white/70 leading-relaxed">
                    Real-time suggestions on pacing, structure, and delivery keep you on track during presentations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-full animate-pulse"></div>
          <Button
            onClick={onStart}
            size="lg"
            className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-16 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
          >
            <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
            Start Your AI Journey
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
