
interface SpeechSegment {
  text: string;
  timestamp: number;
  isFinal: boolean;
}

interface AIFeedback {
  content: string;
  type: 'success' | 'suggestion' | 'warning' | 'info';
  category: 'filler' | 'pace' | 'clarity' | 'general';
}

export class SpeechAnalysisService {
  private transcriptBuffer: string[] = [];
  private wordCountBuffer: number = 0;
  private lastAnalysisTime: number = 0;
  private isActive: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;

  // Configuration
  private readonly MIN_WORDS_FOR_ANALYSIS = 10;
  private readonly MAX_WORDS_FOR_ANALYSIS = 30;
  private readonly ANALYSIS_TIMEOUT_SECONDS = 5;

  // Event callbacks
  private onTranscriptCallback?: (text: string) => void;
  private onFeedbackCallback?: (feedback: AIFeedback) => void;
  private onErrorCallback?: (error: string) => void;

  constructor() {
    this.lastAnalysisTime = Date.now();
  }

  // Event listeners
  onTranscript(callback: (text: string) => void) {
    this.onTranscriptCallback = callback;
  }

  onFeedback(callback: (feedback: AIFeedback) => void) {
    this.onFeedbackCallback = callback;
  }

  onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }

  async startListening(): Promise<boolean> {
    try {
      // Request microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.isActive = true;
      this.startSimulatedTranscription();
      
      return true;
    } catch (error) {
      this.onErrorCallback?.(`Failed to access microphone: ${error}`);
      return false;
    }
  }

  stopListening() {
    this.isActive = false;
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    // Process any remaining buffer
    if (this.transcriptBuffer.length > 0) {
      this.processBufferedText();
    }
  }

  private startSimulatedTranscription() {
    // Simulate real-time speech recognition
    // In production, this would integrate with Deepgram or similar service
    const simulatedPhrases = [
      "Good morning everyone",
      "Today I want to talk about, um, digital transformation",
      "So, like, the main point is that technology is changing rapidly",
      "You know, we need to adapt our business processes accordingly",
      "The data shows significant improvements in efficiency",
      "Uh, let me explain the methodology we used",
      "As you can see from this chart",
      "Moving forward, we should focus on implementation",
      "Thank you for your attention"
    ];

    let phraseIndex = 0;
    
    const simulatePhrase = () => {
      if (!this.isActive || phraseIndex >= simulatedPhrases.length) return;

      const phrase = simulatedPhrases[phraseIndex];
      this.onTranscriptCallback?.(phrase);
      this.processTranscript(phrase, true);
      
      phraseIndex++;
      
      // Schedule next phrase (simulate natural speaking intervals)
      setTimeout(simulatePhrase, 2000 + Math.random() * 3000);
    };

    // Start simulation after a brief delay
    setTimeout(simulatePhrase, 1000);
  }

  private processTranscript(text: string, isFinal: boolean) {
    if (!isFinal || !text.trim()) return;

    this.transcriptBuffer.push(text);
    this.wordCountBuffer += text.split(' ').length;

    const currentTime = Date.now();
    const timeSinceLastAnalysis = (currentTime - this.lastAnalysisTime) / 1000;

    // Intelligent triggering logic
    const endsWithPunctuation = /[.!?]$/.test(text.trim());
    const hasMinWords = this.wordCountBuffer >= this.MIN_WORDS_FOR_ANALYSIS;
    const hasMaxWords = this.wordCountBuffer >= this.MAX_WORDS_FOR_ANALYSIS;
    const timeoutReached = timeSinceLastAnalysis > this.ANALYSIS_TIMEOUT_SECONDS;

    let shouldAnalyze = false;

    if (hasMinWords) {
      if (endsWithPunctuation && this.wordCountBuffer >= this.MAX_WORDS_FOR_ANALYSIS / 2) {
        shouldAnalyze = true;
      } else if (hasMaxWords) {
        shouldAnalyze = true;
      } else if (timeoutReached) {
        shouldAnalyze = true;
      }
    }

    if (shouldAnalyze) {
      this.processBufferedText();
    }
  }

  private processBufferedText() {
    if (this.transcriptBuffer.length === 0) return;

    const textSegment = this.transcriptBuffer.join(' ');
    this.transcriptBuffer = [];
    this.wordCountBuffer = 0;
    this.lastAnalysisTime = Date.now();

    // Analyze with simulated AI (in production, this would call Gemini API)
    this.analyzeWithAI(textSegment);
  }

  private analyzeWithAI(textSegment: string) {
    // Simulate AI analysis - in production this would call Gemini API
    setTimeout(() => {
      const feedback = this.generateAIFeedback(textSegment);
      this.onFeedbackCallback?.(feedback);
    }, 500 + Math.random() * 1000);
  }

  private generateAIFeedback(text: string): AIFeedback {
    const fillerWords = ['um', 'uh', 'like', 'so', 'you know', 'actually', 'basically'];
    const foundFillers = fillerWords.filter(filler => 
      text.toLowerCase().includes(filler)
    );

    if (foundFillers.length > 0) {
      return {
        content: `Detected filler words: "${foundFillers.join(', ')}". Try pausing briefly instead of using filler words to maintain authority.`,
        type: 'suggestion',
        category: 'filler'
      };
    }

    const wordCount = text.split(' ').length;
    const speakingRate = wordCount / 5; // Approximate words per second

    if (speakingRate > 4) {
      return {
        content: "You're speaking quite quickly. Consider slowing down slightly to ensure your audience can follow along.",
        type: 'suggestion',
        category: 'pace'
      };
    }

    if (speakingRate < 1.5) {
      return {
        content: "Your pace is quite slow. You can speak a bit faster to maintain audience engagement.",
        type: 'suggestion',
        category: 'pace'
      };
    }

    // Positive feedback for good speech patterns
    const positiveResponses = [
      { content: "Great clarity in your explanation! Your message is coming across clearly.", type: 'success' as const, category: 'clarity' as const },
      { content: "Excellent pacing. You're giving your audience time to process your ideas.", type: 'success' as const, category: 'pace' as const },
      { content: "Strong delivery! Your confidence is evident in your speech patterns.", type: 'success' as const, category: 'general' as const },
      { content: "Good use of pauses. This helps emphasize your key points effectively.", type: 'info' as const, category: 'general' as const }
    ];

    return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
  }

  isListening(): boolean {
    return this.isActive;
  }
}

export const speechAnalysisService = new SpeechAnalysisService();
