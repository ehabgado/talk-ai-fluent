
import { useState, useEffect, useCallback } from 'react';
import { speechAnalysisService } from '@/services/speechAnalysis';

interface SpeechFeedback {
  id: string;
  content: string;
  type: 'success' | 'suggestion' | 'warning' | 'info';
  category: 'filler' | 'pace' | 'clarity' | 'general';
  timestamp: number;
}

interface UseSpeechAnalysisReturn {
  isListening: boolean;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
  currentTranscript: string;
  recentFeedback: SpeechFeedback[];
  speechMetrics: {
    totalWords: number;
    fillerWordsDetected: number;
    averagePace: string;
    clarityScore: string;
  };
}

export const useSpeechAnalysis = (): UseSpeechAnalysisReturn => {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recentFeedback, setRecentFeedback] = useState<SpeechFeedback[]>([]);
  const [speechMetrics, setSpeechMetrics] = useState({
    totalWords: 0,
    fillerWordsDetected: 0,
    averagePace: 'Normal',
    clarityScore: 'Good'
  });

  const startListening = useCallback(async (): Promise<boolean> => {
    const success = await speechAnalysisService.startListening();
    if (success) {
      setIsListening(true);
      setRecentFeedback([]);
      setCurrentTranscript('');
      setSpeechMetrics({
        totalWords: 0,
        fillerWordsDetected: 0,
        averagePace: 'Normal',
        clarityScore: 'Good'
      });
    }
    return success;
  }, []);

  const stopListening = useCallback(() => {
    speechAnalysisService.stopListening();
    setIsListening(false);
  }, []);

  useEffect(() => {
    // Set up event listeners
    speechAnalysisService.onTranscript((text: string) => {
      setCurrentTranscript(prev => prev ? `${prev} ${text}` : text);
      
      // Update metrics
      setSpeechMetrics(prev => ({
        ...prev,
        totalWords: prev.totalWords + text.split(' ').length
      }));
    });

    speechAnalysisService.onFeedback((feedback) => {
      const newFeedback: SpeechFeedback = {
        id: crypto.randomUUID(),
        content: feedback.content,
        type: feedback.type,
        category: feedback.category,
        timestamp: Date.now()
      };

      setRecentFeedback(prev => [...prev.slice(-4), newFeedback]);

      // Update metrics based on feedback
      if (feedback.category === 'filler') {
        setSpeechMetrics(prev => ({
          ...prev,
          fillerWordsDetected: prev.fillerWordsDetected + 1
        }));
      }

      if (feedback.category === 'pace') {
        setSpeechMetrics(prev => ({
          ...prev,
          averagePace: feedback.content.includes('quickly') ? 'Fast' : 
                      feedback.content.includes('slow') ? 'Slow' : 'Good'
        }));
      }

      if (feedback.category === 'clarity') {
        setSpeechMetrics(prev => ({
          ...prev,
          clarityScore: feedback.type === 'success' ? 'Excellent' : 'Good'
        }));
      }
    });

    speechAnalysisService.onError((error: string) => {
      console.error('Speech analysis error:', error);
      setIsListening(false);
    });

    return () => {
      if (isListening) {
        speechAnalysisService.stopListening();
      }
    };
  }, [isListening]);

  return {
    isListening,
    startListening,
    stopListening,
    currentTranscript,
    recentFeedback,
    speechMetrics
  };
};
