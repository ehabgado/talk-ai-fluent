
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, Brain, TrendingUp, Globe, Play, Star, Users, Award, Zap, Target, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          variant="outline"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
        >
          <Globe className="w-4 h-4" />
          {language === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>

      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main floating orbs with 3D effect */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))',
            left: `${20 + mousePosition.x * 0.02}%`,
            top: `${10 + mousePosition.y * 0.02 - scrollY * 0.1}%`,
            transform: `translate3d(0,0,0) rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`,
            filter: 'blur(40px)',
          }}
        ></div>
        
        <div 
          className="absolute w-80 h-80 rounded-full opacity-40 animate-pulse"
          style={{
            background: 'radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.4), rgba(255, 255, 255, 0))',
            right: `${10 - mousePosition.x * 0.01}%`,
            bottom: `${20 - mousePosition.y * 0.01 + scrollY * 0.05}%`,
            transform: `translate3d(0,0,0) rotateX(${-mousePosition.y * 0.015}deg) rotateY(${-mousePosition.x * 0.015}deg)`,
            filter: 'blur(35px)',
            animationDelay: '1s',
          }}
        ></div>

        {/* 3D Geometric shapes */}
        <div 
          className="absolute w-32 h-32 opacity-20"
          style={{
            left: `${70 + Math.sin(scrollY * 0.001) * 10}%`,
            top: `${30 + Math.cos(scrollY * 0.001) * 10}%`,
            transform: `perspective(1000px) rotateX(${45 + mousePosition.y * 0.05}deg) rotateY(${45 + mousePosition.x * 0.05}deg) rotateZ(${scrollY * 0.1}deg)`,
            background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.4), rgba(59, 130, 246, 0.4))',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        ></div>

        {/* Floating particles with depth */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-pulse"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              transform: `translateZ(${Math.random() * 100}px) translateY(${Math.sin(scrollY * 0.001 + i) * 20}px)`,
            }}
          ></div>
        ))}

        {/* Grid overlay for depth */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: `perspective(1000px) rotateX(60deg) translateZ(-100px)`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="text-center z-20 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section with enhanced 3D effects */}
        <div className="mb-20 animate-fade-in">
          <div className="mb-12 relative group">
            <div 
              className="absolute -inset-8 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`,
              }}
            ></div>
            <h1 
              className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-8 relative z-10 group-hover:scale-105 transition-transform duration-500"
              style={{
                textShadow: '0 0 60px rgba(168, 85, 247, 0.5)',
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.005}deg) rotateY(${mousePosition.x * 0.005}deg)`,
              }}
            >
              Voca AI
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="text-yellow-400 font-semibold tracking-wider">POWERED BY ARTIFICIAL INTELLIGENCE</span>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl text-white/95 font-light leading-tight">
              Transform Your Presentations with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">
                Next-Generation AI Coaching
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Experience the future of presentation training with real-time AI feedback, 
              intelligent content structuring, and performance analytics that adapt to your unique speaking style.
            </p>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
            {[
              { value: "95%", label: "Improvement Rate", icon: TrendingUp, color: "blue" },
              { value: "Real-time", label: "AI Feedback", icon: Zap, color: "purple" },
              { value: "Multi-lang", label: "Support", icon: Globe, color: "pink" },
              { value: "10k+", label: "Users Trained", icon: Users, color: "green" }
            ].map((stat, index) => (
              <Card 
                key={index}
                className="bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group"
                style={{
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 0.01}deg)`,
                }}
              >
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 animate-fade-in delay-300">
          {[
            {
              icon: Brain,
              title: "AI-Powered Planning",
              description: "Upload any document and watch AI transform it into a perfectly structured presentation with optimal flow and timing.",
              features: ["Multi-format support", "Smart content analysis", "Automated structuring"],
              color: "blue"
            },
            {
              icon: Mic,
              title: "Live Coaching",
              description: "Receive real-time feedback on your delivery, pace, and structure as you present, with instant suggestions for improvement.",
              features: ["Real-time analysis", "Voice coaching", "Gesture recognition"],
              color: "green"
            },
            {
              icon: TrendingUp,
              title: "Performance Analytics",
              description: "Comprehensive insights into your presentation skills with detailed metrics and personalized improvement recommendations.",
              features: ["Progress tracking", "Skill assessment", "Custom reports"],
              color: "purple"
            }
          ].map((feature, index) => (
            <Card 
              key={index}
              className="bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 transition-all duration-700 transform hover:scale-105 hover:rotate-1 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="relative mb-6">
                  <feature.icon className={`w-16 h-16 text-${feature.color}-400 mx-auto group-hover:scale-110 transition-transform duration-500 relative z-10`} />
                  <div className={`absolute -inset-4 bg-${feature.color}-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-sm text-white/60">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section with 3D cards */}
        <div className="mb-20 animate-fade-in delay-500">
          <h2 className="text-5xl font-bold text-white mb-4">Why Choose Voca AI?</h2>
          <p className="text-xl text-white/70 mb-16 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their presentation skills with our cutting-edge AI technology.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Star,
                title: "Enterprise-Grade Results",
                description: "Transform nervous speakers into confident presenters with scientifically-proven AI coaching methods used by Fortune 500 companies.",
                stats: "Used by 500+ companies worldwide"
              },
              {
                icon: Globe,
                title: "Global Accessibility",
                description: "Full support for Arabic and English with RTL layouts, cultural context awareness, and region-specific presentation styles.",
                stats: "Available in 12+ languages"
              },
              {
                icon: Award,
                title: "Intelligent Analytics",
                description: "Advanced machine learning algorithms analyze micro-expressions, voice patterns, and content structure for comprehensive feedback.",
                stats: "99.7% accuracy rate"
              },
              {
                icon: Zap,
                title: "Real-Time Processing",
                description: "Lightning-fast AI processing ensures zero-delay feedback during live presentations, maintaining natural flow and engagement.",
                stats: "< 50ms response time"
              }
            ].map((benefit, index) => (
              <Card 
                key={index}
                className="bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 transition-all duration-500 group"
                style={{
                  transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '5deg' : '-5deg'}) rotateX(2deg)`,
                }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <benefit.icon className="w-10 h-10 text-blue-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed mb-4">
                        {benefit.description}
                      </p>
                      <div className="text-sm text-blue-400 font-medium">
                        {benefit.stats}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative group">
          <div 
            className="absolute -inset-12 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-700"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`,
            }}
          ></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Presentations?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join the AI revolution in presentation training. Start your journey to becoming a confident, impactful speaker today.
            </p>
            <Button
              onClick={onStart}
              size="lg"
              className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Begin Your AI Journey</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </Button>
            <div className="flex items-center justify-center gap-6 text-sm text-white/60 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free trial available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Instant setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional CSS for 3D effects */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .group:hover .animate-float {
          animation-duration: 3s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
