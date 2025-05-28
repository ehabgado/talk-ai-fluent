
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface PresentationChatProps {
  extractedContent: string;
  onAnalysisUpdate: (analysis: any) => void;
}

const PresentationChat = ({ extractedContent, onAnalysisUpdate }: PresentationChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `I've analyzed your presentation content and understand the key topics and structure. I can see this covers important concepts that need to be presented effectively.\n\nHow would you like to structure this presentation? I can help you:\n• Adjust the timing for each section\n• Reorganize content flow\n• Emphasize specific topics\n• Add interactive elements\n• Tailor it to your audience\n\nWhat specific aspects would you like to refine?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Generate contextual AI response based on user input
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateContextualResponse(currentInput),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Update analysis based on conversation
      updateAnalysisBasedOnChat(currentInput);
    }, 1500);
  };

  const generateContextualResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('time') || input.includes('duration') || input.includes('long')) {
      return "I understand you want to adjust the timing. Based on your content, I can restructure the sections to fit your preferred duration. Would you like a shorter, more focused presentation or do you need more time to dive deeper into specific topics?";
    }
    
    if (input.includes('audience') || input.includes('target') || input.includes('who')) {
      return "Great question about audience! Knowing your audience helps me tailor the content appropriately. Are you presenting to executives, technical teams, students, or a general audience? This will help me adjust the language complexity and focus areas.";
    }
    
    if (input.includes('interactive') || input.includes('engage') || input.includes('participation')) {
      return "Excellent idea! I can suggest interactive elements based on your content. We could add Q&A breaks, polls, demonstrations, or discussion points at strategic moments. Which type of interaction would work best for your presentation style?";
    }
    
    if (input.includes('main') || input.includes('focus') || input.includes('important') || input.includes('key')) {
      return "I can help emphasize the most critical points from your content. Based on what I've analyzed, I can restructure to give more weight to your key messages. Which specific concepts do you want your audience to remember most?";
    }
    
    if (input.includes('order') || input.includes('sequence') || input.includes('flow') || input.includes('structure')) {
      return "Perfect! Content flow is crucial for impact. I can reorganize your sections for better logical progression, create stronger transitions, or adjust the sequence to build momentum. What flow feels most natural for your content?";
    }
    
    // Default responses for general feedback
    const responses = [
      "That's a valuable insight! Let me adjust the structure to incorporate your feedback. This will make your presentation more effective and aligned with your goals.",
      "Excellent point! I'll refine the content organization based on your input. This will help create a more compelling narrative flow.",
      "I see what you're aiming for. Let me restructure the presentation to better match your vision and presentation style.",
      "Great suggestion! I'll update the analysis to reflect these changes. This will definitely improve audience engagement and message clarity."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const updateAnalysisBasedOnChat = (userInput: string) => {
    // This would update the analysis in the parent component based on chat context
    // For now, we'll trigger a generic update
    onAnalysisUpdate({
      structure: [
        { 
          section: "Refined Opening", 
          duration: "3 minutes", 
          points: ["Audience-tailored hook", "Clear value proposition", "Roadmap preview"] 
        },
        { 
          section: "Core Content", 
          duration: "14 minutes", 
          points: ["Main concept deep-dive", "Evidence and examples", "Interactive checkpoint", "Supporting details"] 
        },
        { 
          section: "Strong Conclusion", 
          duration: "3 minutes", 
          points: ["Key insights summary", "Actionable next steps", "Memorable closing"] 
        }
      ],
      totalDuration: "20 minutes",
      recommendations: [
        "Refined based on your specific requirements",
        "Optimized for your target audience",
        "Enhanced with suggested interactive elements",
        "Structured for maximum impact and retention"
      ]
    });
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Refine Your Structure
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Chat with AI to perfect your presentation structure
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-80 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div className={`rounded-xl p-4 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <Textarea
            placeholder="Ask me to adjust timing, reorder sections, add interactive elements, or tailor for your audience..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            className="flex-1 min-h-[60px] max-h-[100px] resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
            size="lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresentationChat;
