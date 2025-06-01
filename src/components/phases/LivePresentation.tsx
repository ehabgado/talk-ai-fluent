import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mic, MicOff, Play, Pause, Square, MessageSquare, Clock, TrendingUp, CheckCircle, AlertCircle, Zap, Brain, Volume2, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechAnalysis } from '@/hooks/useSpeechAnalysis';

interface LivePresentationProps {
  onNext: () => void;
  onBack: () => void;
}

type CoachingNoteType = 'success' | 'suggestion' | 'warning' | 'info';

interface CoachingNote {
  id: string;
  content: string;
  type: CoachingNoteType;
  timestamp: number;
}

const LivePresentation = ({ onNext, onBack }: LivePresentationProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [liveCoachingNotes, setLiveCoachingNotes] = useState<CoachingNote[]>([]);

  // Speech analysis integration
  const {
    isListening,
    startListening,
    stopListening,
    currentTranscript,
    recentFeedback,
    speechMetrics
  } = useSpeechAnalysis();

  const sections = [
    { name: "Introduction", duration: 120, color: "blue" },
    { name: "Main Content", duration: 900, color: "purple" },
    { name: "Conclusion", duration: 180, color: "green" }
  ];

  const [performanceMetrics, setPerformanceMetrics] = useState({
    pace: speechMetrics.averagePace,
    volume: 'Optimal',
    clarity: speechMetrics.clarityScore,
    engagement: 'High'
  });

  // Update performance metrics when speech analysis provides new data
  useEffect(() => {
    setPerformanceMetrics(prev => ({
      ...prev,
      pace: speechMetrics.averagePace,
      clarity: speechMetrics.clarityScore
    }));
  }, [speechMetrics]);

  // Convert speech analysis feedback to coaching notes
  useEffect(() => {
    if (recentFeedback.length > 0) {
      const latestFeedback = recentFeedback[recentFeedback.length - 1];
      const newNote: CoachingNote = {
        id: latestFeedback.id,
        content: latestFeedback.content,
        type: latestFeedback.type,
        timestamp: duration
      };

      setLiveCoachingNotes(prev => [...prev.slice(-4), newNote]);

      // Show toast for important feedback
      if (latestFeedback.type === 'warning' || latestFeedback.category === 'filler') {
        toast({
          title: "Live Speech Analysis",
          description: latestFeedback.content,
          duration: 4000,
        });
      }
    }
  }, [recentFeedback, duration, toast]);

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

  const startRecording = async () => {
    const speechStarted = await startListening();
    
    if (speechStarted) {
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      setCurrentSection(0);
      
      const initialNote: CoachingNote = {
        id: '1',
        content: "Real-time speech analysis active! Your presentation is being monitored for pace, clarity, and filler words.",
        type: 'info' as CoachingNoteType,
        timestamp: 0
      };
      setLiveCoachingNotes([initialNote]);
      
      toast({
        title: "Live Speech Analysis Started",
        description: "AI is now analyzing your speech in real-time. Speak naturally!",
      });
    } else {
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to enable speech analysis.",
        variant: "destructive"
      });
    }
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    const noteContent = isPaused 
      ? "Speech analysis resumed. Continue presenting naturally." 
      : "Presentation paused. Speech analysis is temporarily stopped.";
    
    const pauseNote: CoachingNote = {
      id: crypto.randomUUID(),
      content: noteContent,
      type: 'info' as CoachingNoteType,
      timestamp: duration
    };
    
    setLiveCoachingNotes(prev => [...prev, pauseNote]);
    
    toast({
      title: isPaused ? "Recording Resumed" : "Recording Paused",
      description: isPaused ? "Speech analysis resumed" : "Speech analysis paused",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    stopListening();
    
    const finalNote: CoachingNote = {
      id: crypto.randomUUID(),
      content: `Presentation completed! Analyzed ${speechMetrics.totalWords} words with ${speechMetrics.fillerWordsDetected} filler words detected. Generating detailed insights...`,
      type: 'success' as CoachingNoteType,
      timestamp: duration
    };
    
    setLiveCoachingNotes(prev => [...prev, finalNote]);
    
    toast({
      title: "Analysis Complete",
      description: "Speech analysis finished. Generating detailed performance report...",
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

  const getNoteIcon = (type: CoachingNoteType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'suggestion': return <Zap className="w-4 h-4 text-blue-600" />;
      default: return <Brain className="w-4 h-4 text-purple-600" />;
    }
  };

  const getNoteColor = (type: CoachingNoteType) => {
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
            Live Speech Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real-time AI feedback on speech patterns, pace, and clarity
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
                  Speech Analysis Controls
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
                    <div className={`w-2 h-2 rounded-full ${
                      isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    {isRecording ? (isPaused ? 'Paused' : 'Analyzing Speech') : 'Ready to Start'}
                  </div>
                </div>

                {/* Live Speech Indicator */}
                {isListening && (
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Waves className="w-4 h-4 animate-pulse" />
                    <span>Listening...</span>
                  </div>
                )}

                <div className="flex gap-2 justify-center">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="bg-red-600 hover:bg-red-700 text-white px-8"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Analysis
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

            {/* Speech Metrics */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Speech Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium">Words Spoken</span>
                  <span className="text-lg font-bold text-blue-600">{speechMetrics.totalWords}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium">Filler Words</span>
                  <span className={`text-lg font-bold ${
                    speechMetrics.fillerWordsDetected > 5 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {speechMetrics.fillerWordsDetected}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium">Speaking Pace</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    speechMetrics.averagePace === 'Good' || speechMetrics.averagePace === 'Normal'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                  }`}>
                    {speechMetrics.averagePace}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium">Clarity</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    speechMetrics.clarityScore === 'Excellent' || speechMetrics.clarityScore === 'Good'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                  }`}>
                    {speechMetrics.clarityScore}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Section Progress - keep existing code */}
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
          </div>

          {/* Center & Right Columns - keep existing coaching notes UI */}
          <div className="lg:col-span-2">
            <Card className="h-full shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Real-Time Speech Coaching
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  AI analysis of your speech patterns, pace, and delivery in real-time
                </p>
              </CardHeader>
              <CardContent className="h-[600px] overflow-hidden">
                {/* Live Transcript Display */}
                {currentTranscript && (
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Live Transcript</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "{currentTranscript.slice(-150)}..."
                    </p>
                  </div>
                )}

                <div className="h-full overflow-y-auto space-y-4 pr-2">
                  {liveCoachingNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Brain className="w-20 h-20 text-gray-400 mb-6" />
                      <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-3">
                        Speech Analysis Ready
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md">
                        Start recording to receive real-time feedback on your speech patterns, pace, and clarity.
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
                                Speech AI • {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
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
