
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Brain, Clock, CheckCircle2, Sparkles } from 'lucide-react';
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
      // Automatically start analysis when content is extracted
      handleAutoAnalyze(content);
    }
  };

  const handleAutoAnalyze = async (content: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with the actual content
    setTimeout(() => {
      setAiAnalysis({
        structure: [
          { section: "Introduction", duration: "2 minutes", points: ["Hook & Welcome", "Topic Overview", "Agenda Preview"] },
          { section: "Main Content", duration: "15 minutes", points: ["Core Concept 1", "Supporting Evidence", "Interactive Element", "Core Concept 2"] },
          { section: "Conclusion", duration: "3 minutes", points: ["Key Takeaways", "Call to Action", "Q&A Opening"] }
        ],
        totalDuration: "20 minutes",
        recommendations: [
          "Start with a compelling story or question to engage your audience",
          "Use visual aids and interactive elements to maintain engagement",
          "Include natural transition phrases between sections",
          "End with a clear call to action to drive results"
        ]
      });
      setIsAnalyzing(false);
      toast({
        title: "AI Analysis Complete",
        description: "Your presentation has been analyzed and optimized for maximum impact.",
      });
    }, 3000);
  };

  const handleAnalysisUpdate = (updatedAnalysis: any) => {
    setAiAnalysis(updatedAnalysis);
  };

  const handleAgree = () => {
    setIsAgreed(true);
    toast({
      title: "Structure Confirmed",
      description: "Your presentation structure has been saved. Ready for live mode!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Presentation Planning
            </h1>
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload your content and collaborate with AI to create the perfect presentation structure
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Chat */}
          <div className="space-y-6">
            {/* File Upload Section */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Upload className="w-6 h-6 text-blue-600" />
                  Upload Your Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onContentExtracted={handleContentExtracted} />
                {isAnalyzing && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-blue-600 animate-spin" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">AI Analysis in Progress</p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">Extracting key insights and optimizing structure...</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Interface - Only show after content is extracted */}
            {extractedContent && (
              <div className="h-[500px]">
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
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 animate-fade-in">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Brain className="w-6 h-6 text-purple-600" />
                    AI-Optimized Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Duration Overview */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">Total Duration</span>
                      <span className="flex items-center gap-2 text-xl font-bold">
                        <Clock className="w-5 h-5" />
                        {aiAnalysis.totalDuration}
                      </span>
                    </div>
                  </div>

                  {/* Structure Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Presentation Flow</h4>
                    {aiAnalysis.structure.map((section: any, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-gray-900 dark:text-white text-lg">{section.section}</h5>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {section.duration}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {section.points.map((point: string, pointIndex: number) => (
                            <li key={pointIndex} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
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
                      AI Recommendations
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
                      Confirm & Save Structure
                    </Button>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="text-green-800 dark:text-green-200 font-semibold text-lg mb-1">Structure Confirmed!</p>
                      <p className="text-green-600 dark:text-green-400">Ready to start your live presentation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : extractedContent ? (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI is analyzing your content...</h3>
                  <p className="text-gray-600 dark:text-gray-300">This will take just a moment. The AI is optimizing your presentation structure for maximum impact.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload your content to begin</h3>
                  <p className="text-gray-600 dark:text-gray-300">Once you upload your presentation materials, AI will analyze and optimize the structure for you.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button variant="outline" onClick={onBack} className="px-8 py-3">
            {t('button.back')}
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!isAgreed}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
          >
            Start Live Presentation →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreSessionPlanning;
