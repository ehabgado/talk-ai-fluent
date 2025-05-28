
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

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
      content: `I've analyzed your uploaded content. Here's what I found:\n\n${extractedContent}\n\nHow would you like me to structure your presentation? I can help you create an optimal flow, suggest timing, and organize your key points for maximum impact.`,
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
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Update analysis based on conversation
      updateAnalysis(inputMessage);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "Great suggestion! I've updated the presentation structure to incorporate your feedback. The new flow will be more engaging and better suited to your audience.",
      "I understand your requirements. Let me adjust the timing and content distribution to match your presentation style and objectives.",
      "That's an excellent point. I'll reorganize the sections to emphasize those key areas and ensure they have the proper impact on your audience.",
      "Perfect! I've refined the structure based on your input. This approach will help you deliver a more compelling and memorable presentation."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const updateAnalysis = (userInput: string) => {
    // Update the analysis based on user input
    const updatedAnalysis = {
      structure: [
        { section: "Opening Hook", duration: "2 minutes", points: ["Compelling story", "Audience question", "Surprising statistic"] },
        { section: "Main Content", duration: "15 minutes", points: ["Key Point 1", "Supporting evidence", "Interactive element"] },
        { section: "Conclusion", duration: "3 minutes", points: ["Key takeaways", "Call to action", "Q&A transition"] }
      ],
      totalDuration: "20 minutes",
      recommendations: [
        "Start with audience engagement",
        "Use visual storytelling techniques",
        "Include interactive elements",
        "End with a strong call to action"
      ]
    };
    onAnalysisUpdate(updatedAnalysis);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          AI Presentation Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 max-h-96 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 border'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-gray-700 border rounded-lg p-3">
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
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask me about your presentation structure, timing, content organization, or any specific requirements..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            className="flex-1 min-h-[60px] resize-none"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresentationChat;
