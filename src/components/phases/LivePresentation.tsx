
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, MicOff, Play, Pause, Square, MessageSquare, Clock, TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LivePresentationProps {
  onNext: () => void;
  onBack: () => void;
}

const LivePresentation = ({ onNext, onBack }: LivePresentationProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [liveNotes, setLiveNotes] = useState<string[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    pace: 'Good',
    volume: 'Optimal',
    clarity: 'Excellent',
    engagement: 'High'
  });

  const sections = [
    { name: "Introduction", duration: 120, color: "blue" },
    { name: "Main Content", duration: 900, color: "purple" },
    { name: "Conclusion", duration: 180, color: "green" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          // Auto-advance sections based on timing
          if (newDuration === 120) setCurrentSection(1);
          if (newDuration === 1020) setCurrentSection(2);
          return newDuration;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Simulate live AI feedback
  useEffect(() => {
    if (isRecording && !isPaused) {
      const feedbackInterval = setInterval(() => {
        const feedbackMessages = [
          "Great eye contact! Keep engaging with your audience.",
          "Consider slowing down slightly for better comprehension.",
          "Excellent use of gestures to emphasize your points.",
          "Perfect transition between sections!",
          "Your voice projection is ideal for the room size.",
          "Try to pause briefly after key points for emphasis.",
          "Strong opening! Your audience is engaged.",
          "Remember to breathe and maintain your natural rhythm."
        ];
        
        const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
        setLiveNotes(prev => [...prev.slice(-4), randomFeedback]); // Keep last 5 notes
        
        // Show toast notification for important feedback
        if (Math.random() > 0.7) {
          toast({
            title: "AI Coach",
            description: randomFeedback,
            duration: 3000,
          });
        }
      }, 8000 + Math.random() * 7000); // Random interval between 8-15 seconds

      return () => clearInterval(feedbackInterval);
    }
  }, [isRecording, isPaused, toast]);

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setDuration(0);
    setCurrentSection(0);
    setLiveNotes(["Presentation started. AI coaching is now active."]);
    toast({
      title: "Recording Started",
      description: "AI coaching is now active. Good luck with your presentation!",
    });
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Recording Resumed" : "Recording Paused",
      description: isPaused ? "AI feedback resumed" : "AI feedback paused",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    toast({
      title: "Recording Stopped",
      description: "Analyzing your presentation performance...",
    });
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSectionProgress = () => {
    const section = sections[currentSection];
    if (!section) return 0;
    
    const sectionStart = sections.slice(0, currentSection).reduce((total, s) => total + s.duration, 0);
    const sectionElapsed = duration - sectionStart;
    return Math.min((sectionElapsed / section.duration) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Live AI Coaching
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real-time feedback and performance tracking
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls & Timer */}
          <div className="space-y-6">
            {/* Recording Controls */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-500" />
                  Recording Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatTime(duration)}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    isRecording 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Stopped'}
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-8"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={pauseRecording}
                        variant="outline"
                        size="lg"
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </Button>
                      <Button
                        onClick={stopRecording}
                        variant="destructive"
                        size="lg"
                      >
                        <Square className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section Progress */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Section Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.map((section, index) => (
                  <div key={index} className={`p-3 rounded-lg border-2 transition-all ${
                    index === currentSection 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : index < currentSection 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{section.name}</span>
                      <span className="text-sm text-gray-500">
                        {Math.floor(section.duration / 60)}min
                      </span>
                    </div>
                    {index === currentSection && (
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-${section.color}-500 transition-all duration-300`}
                          style={{ width: `${getSectionProgress()}%` }}
                        ></div>
                      </div>
                    )}
                    {index < currentSection && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Completed</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Live Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(performanceMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium capitalize">{key}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      value === 'Excellent' || value === 'High' || value === 'Optimal' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                        : value === 'Good' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Live Notes */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  Live AI Coaching Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] overflow-hidden">
                <div className="h-full overflow-y-auto space-y-4 pr-2">
                  {liveNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Zap className="w-16 h-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        AI Coach Ready
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Start recording to receive real-time coaching feedback and performance insights.
                      </p>
                    </div>
                  ) : (
                    liveNotes.map((note, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 animate-fade-in shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                AI Coach
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(duration)}
                              </span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {note}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack} className="px-8">
            {t('button.back')}
          </Button>
          <Button 
            onClick={onNext} 
            disabled={isRecording}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
          >
            View Analysis →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LivePresentation;
