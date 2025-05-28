
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Brain, Clock, CheckCircle2, Sparkles, FileText } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import PresentationChat from '@/components/PresentationChat';
import { useToast } from '@/hooks/use-toast';

interface PreSessionPlanningProps {
  onNext: () => void;
  onBack: () => void;
}

const PreSessionPlanning = ({ onNext, onBack }: PreSessionPlanningProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [extractedContent, setExtractedContent] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleContentExtracted = (content: string) => {
    setExtractedContent(content);
    if (content) {
      handleAutoAnalyze(content);
    }
  };

  const handleAutoAnalyze = async (content: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with actual content-based structure
    setTimeout(() => {
      // Create a more realistic analysis based on content keywords
      const contentLower = content.toLowerCase();
      const hasIntro = contentLower.includes('introduction') || contentLower.includes('overview');
      const hasConclusion = contentLower.includes('conclusion') || contentLower.includes('summary');
      const keyTopics = extractKeyTopics(content);
      
      setAiAnalysis({
        structure: [
          { 
            section: hasIntro ? "Introduction & Overview" : "Opening Statement", 
            duration: "3 minutes", 
            points: [
              "Welcome and context setting",
              `Introduce main topic: ${keyTopics[0] || 'Core concept'}`,
              "Preview key discussion points"
            ] 
          },
          { 
            section: "Main Content Analysis", 
            duration: "12 minutes", 
            points: [
              `Deep dive into ${keyTopics[0] || 'primary topic'}`,
              `Explore ${keyTopics[1] || 'supporting concepts'}`,
              "Present evidence and examples from your material",
              `Address ${keyTopics[2] || 'key implications'}`
            ] 
          },
          { 
            section: hasConclusion ? "Synthesis & Next Steps" : "Key Takeaways", 
            duration: "5 minutes", 
            points: [
              "Summarize main insights",
              "Connect concepts to practical applications",
              "Open discussion and Q&A"
            ] 
          }
        ],
        totalDuration: "20 minutes",
        contentSummary: content.substring(0, 200) + "...",
        keyTopics: keyTopics.slice(0, 5),
        recommendations: [
          `Start by establishing context for ${keyTopics[0] || 'your main topic'}`,
          "Use the visual elements from your presentation to support key points",
          `Emphasize the connection between ${keyTopics[0]} and ${keyTopics[1]}`,
          "End with actionable insights your audience can apply"
        ]
      });
      setIsAnalyzing(false);
      toast({
        title: "Content Analysis Complete",
        description: "AI has analyzed your specific content and created a customized structure.",
      });
    }, 3000);
  };

  const extractKeyTopics = (content: string): string[] => {
    // Simple keyword extraction - in real implementation, this would be more sophisticated
    const words = content.toLowerCase().split(/\W+/);
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'this', 'that', 'these', 'those'];
    const meaningfulWords = words.filter(word => word.length > 4 && !stopWords.includes(word));
    const wordFreq: {[key: string]: number} = {};
    
    meaningfulWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
  };

  const handleAnalysisUpdate = (updatedAnalysis: any) => {
    setAiAnalysis(updatedAnalysis);
  };

  const handleAgree = () => {
    setIsAgreed(true);
    toast({
      title: "Structure Confirmed",
      description: "Your customized presentation structure has been saved. Ready for live mode!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Content Analysis
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload your presentation and let AI analyze the specific content to create a customized talk structure
          </p>
        </div>

        {!extractedContent ? (
          /* Upload Section - Full Width When No Content */
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Upload className="w-7 h-7 text-blue-600" />
                  Upload Your Presentation
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Just like ChatGPT, upload your file and AI will understand and analyze your specific content
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <FileUpload onContentExtracted={handleContentExtracted} />
                
                {isAnalyzing && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-4">
                      <Brain className="w-8 h-8 text-blue-600 animate-spin" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-800 dark:text-blue-200 text-lg">
                          AI is Reading Your Content...
                        </p>
                        <p className="text-blue-600 dark:text-blue-300 mt-1">
                          Analyzing structure, extracting key concepts, and creating your personalized talk flow
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Two Column Layout - After Content Upload */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Content Summary & Chat */}
            <div className="space-y-6">
              {/* Content Summary */}
              <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-6 h-6 text-green-600" />
                    Your Content Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aiAnalysis?.contentSummary ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {aiAnalysis.contentSummary}
                        </p>
                      </div>
                      {aiAnalysis.keyTopics && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Key Topics Identified:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.keyTopics.map((topic: string, index: number) => (
                              <span 
                                key={index} 
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      Content analysis in progress...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Chat Interface */}
              {extractedContent && (
                <div className="h-[400px]">
                  <PresentationChat 
                    extractedContent={extractedContent}
                    onAnalysisUpdate={handleAnalysisUpdate}
                  />
                </div>
              )}
            </div>

            {/* Right Column - AI Analysis Results */}
            <div className="space-y-6">
              {aiAnalysis ? (
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      Customized Talk Structure
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">
                      Based on your specific content analysis
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Duration Overview */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">Recommended Duration</span>
                        <span className="flex items-center gap-2 text-xl font-bold">
                          <Clock className="w-5 h-5" />
                          {aiAnalysis.totalDuration}
                        </span>
                      </div>
                    </div>

                    {/* Structure Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Content-Based Flow
                      </h4>
                      {aiAnalysis.structure.map((section: any, index: number) => (
                        <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {section.section}
                            </h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              {section.duration}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {section.points.map((point: string, pointIndex: number) => (
                              <li key={pointIndex} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                        Content-Specific Recommendations
                      </h4>
                      <ul className="space-y-3">
                        {aiAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    {!isAgreed ? (
                      <Button 
                        onClick={handleAgree}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold"
                        size="lg"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Perfect! Use This Structure
                      </Button>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <p className="text-green-800 dark:text-green-200 font-semibold text-lg mb-1">
                          Structure Confirmed!
                        </p>
                        <p className="text-green-600 dark:text-green-400">
                          Ready to start your customized presentation
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      AI is analyzing your content...
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Reading through your presentation to understand the specific topics and create a customized structure
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8 max-w-7xl mx-auto">
          <Button variant="outline" onClick={onBack} className="px-8 py-3" size="lg">
            {t('button.back')}
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!isAgreed}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 disabled:opacity-50"
            size="lg"
          >
            Start Live Presentation →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreSessionPlanning;
