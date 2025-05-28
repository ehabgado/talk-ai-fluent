
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, MessageCircle, Brain, Clock, CheckCircle2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';

interface PreSessionPlanningProps {
  onNext: () => void;
  onBack: () => void;
}

const PreSessionPlanning = ({ onNext, onBack }: PreSessionPlanningProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please upload a file or enter presentation content first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis - In production, this would call Gemini Flash API
    setTimeout(() => {
      setAiAnalysis({
        structure: [
          { section: "Introduction", duration: "2 minutes", points: ["Hook", "Overview", "Agenda"] },
          { section: "Main Content", duration: "15 minutes", points: ["Key Point 1", "Key Point 2", "Key Point 3"] },
          { section: "Conclusion", duration: "3 minutes", points: ["Summary", "Call to Action", "Q&A"] }
        ],
        totalDuration: "20 minutes",
        recommendations: [
          "Start with a compelling story or statistic",
          "Use visual aids for better engagement",
          "Practice transitions between sections"
        ]
      });
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your content and suggested an optimal structure.",
      });
    }, 2000);
  };

  const handleAgree = () => {
    setIsAgreed(true);
    toast({
      title: "Structure Confirmed",
      description: "Your presentation structure has been saved. Ready for live mode!",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('planning.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload your content and let AI help structure your presentation
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {t('planning.upload')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload onContentExtracted={setContent} />
              
              <div className="relative">
                <Textarea
                  placeholder="Or type your presentation content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {t('planning.chat')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any specific requirements, audience details, or presentation style preferences..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                {t('planning.analyze')}
              </>
            )}
          </Button>
        </div>

        {/* AI Analysis Results */}
        <div className="space-y-6">
          {aiAnalysis && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  {t('planning.structure')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Total Duration</span>
                    <span className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-4 h-4" />
                      {aiAnalysis.totalDuration}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {aiAnalysis.structure.map((section: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-900">{section.section}</h4>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {section.duration}
                        </span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {section.points.map((point: string, pointIndex: number) => (
                          <li key={pointIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">AI Recommendations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {aiAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {!isAgreed && (
                  <Button 
                    onClick={handleAgree}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {t('planning.agree')}
                  </Button>
                )}

                {isAgreed && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold">Structure Confirmed!</p>
                    <p className="text-green-600 text-sm">Ready to start your live presentation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          {t('button.back')}
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isAgreed}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {t('button.next')}
        </Button>
      </div>
    </div>
  );
};

export default PreSessionPlanning;
