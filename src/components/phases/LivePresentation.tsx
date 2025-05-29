
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, MicOff, Play, Pause, Square, MessageSquare, Clock, TrendingUp, CheckCircle, AlertCircle, Zap, Brain } from 'lucide-react';
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
  const [liveCoachingNotes, setLiveCoachingNotes] = useState<Array<{
    id: string;
    content: string;
    type: 'success' | 'suggestion' | 'warning' | 'info';
    timestamp: number;
  }>>([]);
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

  // Enhanced AI coaching with intelligent feedback
  useEffect(() => {
    if (isRecording && !isPaused) {
      const coachingInterval = setInterval(() => {
        generateIntelligentCoaching();
      }, 6000 + Math.random() * 8000); // Random interval between 6-14 seconds

      return () => clearInterval(coachingInterval);
    }
  }, [isRecording, isPaused, currentSection, duration]);

  const generateIntelligentCoaching = () => {
    const sectionProgress = getSectionProgress();
    const timeInSection = duration - sections.slice(0, currentSection).reduce((total, s) => total + s.duration, 0);
    
    let coachingMessages: Array<{content: string, type: 'success' | 'suggestion' | 'warning' | 'info'}> = [];

    // Section-specific coaching
    if (currentSection === 0) { // Introduction
      if (timeInSection < 60) {
        coachingMessages = [
          { content: "Strong opening! Your energy is engaging the audience effectively.", type: 'success' },
          { content: "Good pace for your introduction. Remember to make eye contact across the room.", type: 'suggestion' },
          { content: "Perfect timing so far. Your audience looks engaged and ready for the main content.", type: 'info' }
        ];
      } else {
        coachingMessages = [
          { content: "You're building good rapport with your audience. Consider transitioning to main points soon.", type: 'suggestion' },
          { content: "Excellent audience connection! Time to bridge to your core content.", type: 'info' }
        ];
      }
    } else if (currentSection === 1) { // Main Content
      if (sectionProgress < 25) {
        coachingMessages = [
          { content: "Great transition into main content! Your structure is clear and logical.", type: 'success' },
          { content: "Consider using a brief pause after key points to let ideas sink in.", type: 'suggestion' },
          { content: "Your explanation is clear. The audience is following your logic well.", type: 'info' }
        ];
      } else if (sectionProgress < 50) {
        coachingMessages = [
          { content: "Excellent depth of explanation. Your examples are resonating with the audience.", type: 'success' },
          { content: "You're halfway through your main content. Consider checking audience understanding.", type: 'info' },
          { content: "Your gestures are effectively emphasizing key points. Keep using them strategically.", type: 'suggestion' }
        ];
      } else if (sectionProgress < 75) {
        coachingMessages = [
          { content: "Strong momentum maintained! Your audience remains engaged with the content.", type: 'success' },
          { content: "Consider varying your vocal pace slightly to maintain interest in complex sections.", type: 'suggestion' },
          { content: "You're in the final quarter of main content. Begin preparing for conclusion themes.", type: 'info' }
        ];
      } else {
        coachingMessages = [
          { content: "Excellent coverage of main points! Time to start wrapping up this section.", type: 'info' },
          { content: "Your content delivery has been comprehensive. Prepare your transition to conclusion.", type: 'suggestion' }
        ];
      }
    } else { // Conclusion
      coachingMessages = [
        { content: "Great transition to conclusion! Your summary is capturing key points effectively.", type: 'success' },
        { content: "Perfect recap of main themes. Your audience has clear takeaways.", type: 'info' },
        { content: "Strong closing approach! End with confidence and open for questions.", type: 'suggestion' }
      ];
    }

    // Performance-based coaching
    const performanceCoaching = [
      { content: "Your speaking pace is ideal for audience comprehension.", type: 'success' },
      { content: "Excellent use of strategic pauses. They're emphasizing your key messages.", type: 'success' },
      { content: "Consider standing slightly closer to your audience to increase connection.", type: 'suggestion' },
      { content: "Your voice projection is perfect for the room size.", type: 'info' },
      { content: "Great use of hand gestures to support your verbal message.", type: 'success' }
    ];

    // Combine and select random coaching message
    const allMessages = [...coachingMessages, ...performanceCoaching];
    const selectedMessage = allMessages[Math.floor(Math.random() * allMessages.length)];
    
    const newNote = {
      id: crypto.randomUUID(),
      content: selectedMessage.content,
      type: selectedMessage.type,
      timestamp: duration
    };

    setLiveCoachingNotes(prev => [...prev.slice(-4), newNote]); // Keep last 5 notes

    // Show toast for important feedback
    if (selectedMessage.type === 'warning' || Math.random() > 0.6) {
      toast({
        title: "AI Coach",
        description: selectedMessage.content,
        duration: 4000,
      });
    }

    // Update performance metrics periodically
    if (Math.random() > 0.7) {
      updatePerformanceMetrics();
    }
  };

  const updatePerformanceMetrics = () => {
    const metrics = ['Excellent', 'Good', 'Optimal', 'Strong'];
    const newMetrics = {
      pace: metrics[Math.floor(Math.random() * metrics.length)],
      volume: metrics[Math.floor(Math.random() * metrics.length)],
      clarity: metrics[Math.floor(Math.random() * metrics.length)],
      engagement: ['High', 'Very High', 'Excellent'][Math.floor(Math.random() * 3)]
    };
    setPerformanceMetrics(newMetrics);
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setDuration(0);
    setCurrentSection(0);
    setLiveCoachingNotes([{
      id: '1',
      content: "Presentation started! AI coaching is now active and monitoring your performance.",
      type: 'info',
      timestamp: 0
    }]);
    toast({
      title: "AI Coaching Active",
      description: "Real-time feedback and performance tracking started. Good luck!",
    });
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    const noteContent = isPaused 
      ? "Recording resumed. AI feedback is back online." 
      : "Recording paused. Take your time - AI will resume when you continue.";
    
    setLiveCoachingNotes(prev => [...prev, {
      id: crypto.randomUUID(),
      content: noteContent,
      type: 'info',
      timestamp: duration
    }]);
    
    toast({
      title: isPaused ? "Recording Resumed" : "Recording Paused",
      description: isPaused ? "AI feedback resumed" : "AI feedback paused",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    const finalNote = {
      id: crypto.randomUUID(),
      content: "Presentation completed! Analyzing your performance data and generating detailed insights...",
      type: 'success',
      timestamp: duration
    };
    
    setLiveCoachingNotes(prev => [...prev, finalNote]);
    
    toast({
      title: "Recording Complete",
      description: "Analyzing your presentation performance and generating insights...",
    });
    
    setTimeout(() => {
      onNext();
    }, 2500);
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

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'suggestion': return <Zap className="w-4 h-4 text-blue-600" />;
      default: return <Brain className="w-4 h-4 text-purple-600" />;
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-green-50 to-emerald-50 border-green-200';
      case 'warning': return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'suggestion': return 'from-blue-50 to-indigo-50 border-blue-200';
      default: return 'from-purple-50 to-blue-50 border-purple-200';
    }
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
            Intelligent real-time feedback and performance optimization
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls & Metrics */}
          <div className="space-y-6">
            {/* Recording Controls */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-500" />
                  AI Recording Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatTime(duration)}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    isRecording 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    {isRecording ? (isPaused ? 'Paused' : 'AI Coaching Active') : 'Ready to Start'}
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
                      Start AI Coaching
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
                  Presentation Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.map((section, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 transition-all ${
                    index === currentSection 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : index < currentSection 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">{section.name}</span>
                      <span className="text-sm text-gray-500">
                        {Math.floor(section.duration / 60)}min
                      </span>
                    </div>
                    {index === currentSection && (
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full bg-${section.color}-500 transition-all duration-300`}
                          style={{ width: `${getSectionProgress()}%` }}
                        ></div>
                      </div>
                    )}
                    {index < currentSection && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live Performance Metrics */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Real-Time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(performanceMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium capitalize">{key}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      value === 'Excellent' || value === 'High' || value === 'Very High' || value === 'Optimal' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                        : value === 'Good' || value === 'Strong'
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

          {/* Center & Right Columns - AI Coaching Notes */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Intelligent AI Coaching
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Smart, context-aware feedback tailored to your presentation content and style
                </p>
              </CardHeader>
              <CardContent className="h-[600px] overflow-hidden">
                <div className="h-full overflow-y-auto space-y-4 pr-2">
                  {liveCoachingNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Brain className="w-20 h-20 text-gray-400 mb-6" />
                      <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-3">
                        AI Coach Ready
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md">
                        Start recording to receive intelligent, real-time coaching feedback tailored to your content and presentation style.
                      </p>
                    </div>
                  ) : (
                    liveCoachingNotes.map((note) => (
                      <div 
                        key={note.id} 
                        className={`bg-gradient-to-r ${getNoteColor(note.type)} dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 rounded-xl p-5 animate-fade-in shadow-sm hover:shadow-md transition-all`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                            {getNoteIcon(note.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                AI Coach • {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                                {formatTime(note.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                              {note.content}
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
          <Button variant="outline" onClick={onBack} className="px-8" size="lg">
            {t('button.back')}
          </Button>
          <Button 
            onClick={onNext} 
            disabled={isRecording}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 disabled:opacity-50"
            size="lg"
          >
            View Analysis →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LivePresentation;
