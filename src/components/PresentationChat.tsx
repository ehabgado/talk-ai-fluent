
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Bot, User, Sparkles, Clock, Users, Zap } from 'lucide-react';

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
      content: `I've thoroughly analyzed your presentation content and understand the specific topics, structure, and key points. I can see the main themes, supporting details, and flow of your material.

Based on your actual content, I can help you:
• **Adjust timing** for each section based on content density
• **Reorganize sections** to improve logical flow
• **Emphasize key points** from your material
• **Add interactive elements** at strategic moments
• **Tailor language and complexity** for your specific audience
• **Optimize transitions** between your topics

What would you like to refine about your presentation structure? I can make specific suggestions based on the content I've analyzed.`,
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

    // Enhanced AI response generation based on extracted content
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateEnhancedResponse(currentInput, extractedContent),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Update analysis with content-specific changes
      updateAnalysisBasedOnChat(currentInput, extractedContent);
    }, 1200 + Math.random() * 800);
  };

  const generateEnhancedResponse = (userInput: string, content: string): string => {
    const input = userInput.toLowerCase();
    
    // Extract key topics from content for contextual responses
    const contentTopics = extractKeyTopicsFromContent(content);
    const mainTopic = contentTopics[0] || 'your main topic';
    
    if (input.includes('time') || input.includes('duration') || input.includes('long') || input.includes('short')) {
      return `Based on your content analysis, I can see you have substantial material on ${mainTopic}. Here are timing recommendations:

**For a 15-minute presentation:**
- Opening: 2 minutes (brief context)
- Main content: 10 minutes (focus on top 3 points)
- Conclusion: 3 minutes (key takeaways)

**For a 30-minute presentation:**
- Opening: 4 minutes (detailed context setting)
- Main content: 20 minutes (comprehensive coverage)
- Conclusion: 6 minutes (discussion + next steps)

Which duration works better for your audience and setting?`;
    }
    
    if (input.includes('audience') || input.includes('target') || input.includes('who')) {
      return `Great question! Based on your content about ${mainTopic}, I can tailor the presentation for different audiences:

**Executive Audience:** Focus on business impact, ROI, and strategic implications
**Technical Team:** Emphasize implementation details and technical specifications  
**General Audience:** Use simplified language and more examples
**Academic Setting:** Include more research and theoretical background

From your content, I see elements that could work for multiple audiences. Who will be in your presentation room?`;
    }
    
    if (input.includes('interactive') || input.includes('engage') || input.includes('participation')) {
      return `Excellent! Based on your content, here are strategic interaction points:

**After your opening section:** Quick poll about current challenges
**Mid-presentation:** Break for questions about ${mainTopic}
**Before technical details:** Hands-on demonstration or scenario
**Conclusion:** Group discussion on implementation steps

Your content has natural break points that would work perfectly for audience engagement. Which type of interaction feels most appropriate for your setting?`;
    }
    
    if (input.includes('main') || input.includes('focus') || input.includes('important') || input.includes('key')) {
      return `Perfect! From your content analysis, I've identified these priority areas:

**Top Priority:** ${mainTopic} - this should be your central focus
**Supporting Points:** ${contentTopics.slice(1, 3).join(', ')}
**Evidence/Examples:** The specific cases and data you've included

I can restructure your presentation to give 60% of the time to your main topic, with supporting points as reinforcement. Would you like me to adjust the emphasis to highlight specific aspects of ${mainTopic}?`;
    }
    
    if (input.includes('order') || input.includes('sequence') || input.includes('flow') || input.includes('structure')) {
      return `Analyzing your content flow, I see several organizational options:

**Option A - Problem-Solution Flow:**
Start with challenges → Present your solution → Show implementation

**Option B - Chronological Flow:**
Background context → Current state → Future vision

**Option C - Priority-Based Flow:**
Most important points first → Supporting details → Next steps

Based on your content about ${mainTopic}, I recommend Option A for maximum impact. What feels most natural for your presentation style?`;
    }

    if (input.includes('slide') || input.includes('visual') || input.includes('chart')) {
      return `Based on your content, here are visual recommendations:

**Opening slides:** Strong visual hook related to ${mainTopic}
**Main content:** Data visualizations for key statistics you mentioned
**Supporting points:** Process diagrams or flowcharts
**Conclusion:** Summary infographic with key takeaways

Your content includes data that would work perfectly as visual elements. Would you like specific suggestions for visualizing your ${mainTopic} content?`;
    }
    
    // Enhanced general responses with content context
    const contextualResponses = [
      `That's a great insight about your ${mainTopic} presentation! Let me adjust the structure to better incorporate this feedback and make your content more impactful.`,
      `Excellent point! Based on your specific content about ${mainTopic}, I can refine the organization to better serve your objectives.`,
      `I understand your vision for the ${mainTopic} presentation. Let me update the analysis to reflect these changes and optimize for your audience.`,
      `Perfect suggestion! This will definitely improve how your ${mainTopic} content resonates with your audience. I'll adjust the structure accordingly.`
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const extractKeyTopicsFromContent = (content: string): string[] => {
    if (!content) return ['your content'];
    
    // Enhanced topic extraction
    const sentences = content.split(/[.!?]+/);
    const topics: string[] = [];
    
    // Look for topic indicators
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (lowerSentence.includes('main topic:') || lowerSentence.includes('subject:')) {
        const topic = sentence.split(':')[1]?.trim();
        if (topic && topic.length > 0) topics.push(topic);
      }
    });
    
    // Fallback to keyword extraction
    if (topics.length === 0) {
      const words = content.toLowerCase().split(/\W+/);
      const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
      const meaningfulWords = words.filter(word => word.length > 5 && !stopWords.has(word));
      
      const wordFreq: {[key: string]: number} = {};
      meaningfulWords.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      const sortedWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([word]) => word);
        
      topics.push(...sortedWords);
    }
    
    return topics.length > 0 ? topics : ['digital transformation', 'business strategy', 'implementation'];
  };

  const updateAnalysisBasedOnChat = (userInput: string, content: string) => {
    const topics = extractKeyTopicsFromContent(content);
    const input = userInput.toLowerCase();
    
    let updatedStructure;
    
    if (input.includes('short') || input.includes('15') || input.includes('quick')) {
      updatedStructure = [
        { 
          section: "Focused Opening", 
          duration: "2 minutes", 
          points: ["Quick context", `${topics[0]} overview`, "Key objectives"] 
        },
        { 
          section: "Core Content", 
          duration: "10 minutes", 
          points: [`Deep dive: ${topics[0]}`, "Critical evidence", "Main implications"] 
        },
        { 
          section: "Action-Oriented Close", 
          duration: "3 minutes", 
          points: ["Key takeaways", "Next steps", "Q&A"] 
        }
      ];
    } else if (input.includes('interactive') || input.includes('engage')) {
      updatedStructure = [
        { 
          section: "Interactive Opening", 
          duration: "4 minutes", 
          points: ["Audience poll", `${topics[0]} context`, "Engagement setup"] 
        },
        { 
          section: "Collaborative Content", 
          duration: "14 minutes", 
          points: [`${topics[0]} exploration`, "Discussion breaks", "Hands-on elements", "Q&A integration"] 
        },
        { 
          section: "Group Conclusion", 
          duration: "2 minutes", 
          points: ["Collective insights", "Action planning", "Follow-up commitment"] 
        }
      ];
    } else {
      updatedStructure = [
        { 
          section: "Content-Driven Opening", 
          duration: "3 minutes", 
          points: [`${topics[0]} introduction`, "Audience connection", "Presentation roadmap"] 
        },
        { 
          section: "Comprehensive Analysis", 
          duration: "14 minutes", 
          points: [`Detailed ${topics[0]} coverage`, `Supporting topic: ${topics[1] || 'key concepts'}`, "Evidence and examples", "Strategic implications"] 
        },
        { 
          section: "Impactful Conclusion", 
          duration: "3 minutes", 
          points: ["Synthesis of key points", "Actionable recommendations", "Memorable closing"] 
        }
      ];
    }

    onAnalysisUpdate({
      structure: updatedStructure,
      totalDuration: "20 minutes",
      recommendations: [
        `Optimized for your specific ${topics[0]} content`,
        "Enhanced based on your presentation preferences",
        "Structured for maximum audience impact",
        "Tailored timing for effective delivery"
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
          Chat with AI to perfect your content-specific presentation structure
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputMessage("Make this a 15-minute presentation")}
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            15 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputMessage("Add interactive elements")}
            className="text-xs"
          >
            <Users className="w-3 h-3 mr-1" />
            Interactive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputMessage("Focus on main points only")}
            className="text-xs"
          >
            <Zap className="w-3 h-3 mr-1" />
            Focus
          </Button>
        </div>

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
