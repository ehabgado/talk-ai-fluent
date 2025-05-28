
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Square, Mic, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FeedbackToast from '@/components/FeedbackToast';

interface LivePresentationProps {
  onNext: () => void;
  onBack: () => void;
}

const LivePresentation = ({ onNext, onBack }: LivePresentationProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedbackMessages, setFeedbackMessages] = useState<Array<{
    id: string;
    type: 'pace-fast' | 'pace-slow' | 'filler' | 'structure' | 'good';
    message: string;
    timestamp: number;
  }>>([]);

  const sections = [
    { name: "Introduction", plannedDuration: 120, status: "current" },
    { name: "Main Content", plannedDuration: 900, status: "upcoming" },
    { name: "Conclusion", plannedDuration: 180, status: "upcoming" },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Simulate real-time feedback
  useEffect(() => {
    if (!isRecording) return;

    const feedbackInterval = setInterval(() => {
      const feedbackTypes = [
        { type: 'pace-fast', message: t('live.feedback.fast') },
        { type: 'pace-slow', message: t('live.feedback.slow') },
        { type: 'filler', message: t('live.feedback.filler') },
        { type: 'structure', message: t('live.feedback.structure') },
        { type: 'good', message: t('live.feedback.pace') },
      ];

      // Randomly trigger feedback (30% chance every 5 seconds)
      if (Math.random() < 0.3) {
        const randomFeedback = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
        const newFeedback = {
          id: Date.now().toString(),
          type: randomFeedback.type as any,
          message: randomFeedback.message,
          timestamp: Date.now(),
        };
        
        setFeedbackMessages(prev => [...prev, newFeedback]);
        
        // Remove feedback after 60 seconds
        setTimeout(() => {
          setFeedbackMessages(prev => prev.filter(f => f.id !== newFeedback.id));
        }, 60000);
      }
    }, 5000);

    return () => clearInterval(feedbackInterval);
  }, [isRecording, t]);

  const startRecording = async () => {
    try {
      // In production, this would initialize Deepgram SDK
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setElapsedTime(0);
      toast({
        title: "Recording Started",
        description: "Your presentation is being analyzed in real-time.",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use live mode.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Your presentation data has been saved for analysis.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('live.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Real-time AI feedback to improve your delivery
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Recording Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t('live.start')}
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  {t('live.stop')}
                </Button>
              )}

              {isRecording && (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Presentation Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      index === currentSection ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {section.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTime(section.plannedDuration)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSection 
                          ? 'bg-blue-600' 
                          : index < currentSection 
                            ? 'bg-green-600' 
                            : 'bg-gray-200'
                      }`}
                      style={{ 
                        width: index === currentSection 
                          ? `${Math.min((elapsedTime / section.plannedDuration) * 100, 100)}%`
                          : index < currentSection ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live Feedback Display */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px]">
            <CardHeader>
              <CardTitle>Real-time Feedback</CardTitle>
            </CardHeader>
            <CardContent className="relative h-full">
              {!isRecording ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Start recording to see real-time feedback
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Live Analysis Active</span>
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      AI is monitoring your pace, structure, and delivery
                    </p>
                  </div>

                  {/* Current Section Indicator */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Current Section: {sections[currentSection]?.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-blue-600">
                      <span>Elapsed: {formatTime(elapsedTime)}</span>
                      <span>Planned: {formatTime(sections[currentSection]?.plannedDuration || 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feedback Toasts */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {feedbackMessages.map((feedback) => (
          <FeedbackToast
            key={feedback.id}
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedbackMessages(prev => prev.filter(f => f.id !== feedback.id))}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          {t('button.back')}
        </Button>
        <Button 
          onClick={onNext}
          disabled={isRecording}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {t('button.next')}
        </Button>
      </div>
    </div>
  );
};

export default LivePresentation;
