
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  BarChart3,
  Award
} from 'lucide-react';

interface PostAnalysisProps {
  onRestart: () => void;
  onBack: () => void;
}

const PostAnalysis = ({ onRestart, onBack }: PostAnalysisProps) => {
  const { t } = useLanguage();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showProgressTracking, setShowProgressTracking] = useState(false);

  // Mock analysis data - In production, this would come from Gemini Flash API
  const analysisData = {
    overallScore: 78,
    duration: "18:45",
    sections: [
      { name: "Introduction", plannedTime: "2:00", actualTime: "2:15", score: 85 },
      { name: "Main Content", plannedTime: "15:00", actualTime: "14:30", score: 75 },
      { name: "Conclusion", plannedTime: "3:00", actualTime: "2:00", score: 70 }
    ],
    metrics: {
      paceConsistency: 72,
      fillerWords: 15,
      structureAdherence: 88,
      timeManagement: 82
    },
    strengths: [
      "Excellent introduction engagement",
      "Good use of structured content",
      "Strong conclusion impact"
    ],
    improvements: [
      "Reduce filler words (detected 15 instances)",
      "Maintain consistent pace in main section",
      "Extend conclusion to planned duration"
    ],
    suggestedGoals: [
      "Reduce filler words by 50%",
      "Improve pace consistency to 80%+",
      "Better time management per section",
      "Increase overall engagement score"
    ]
  };

  const progressData = [
    { session: "Session 1", overallScore: 65, fillerWords: 25, paceScore: 60 },
    { session: "Session 2", overallScore: 72, fillerWords: 18, paceScore: 68 },
    { session: "Session 3", overallScore: 78, fillerWords: 15, paceScore: 72 },
  ];

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('analysis.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive analysis of your presentation performance
        </p>
      </div>

      {/* Overall Performance */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('analysis.performance')}</h2>
              <p className="text-gray-600">Session completed: {analysisData.duration}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{analysisData.overallScore}%</div>
              <div className="flex items-center gap-1 text-blue-600">
                <Award className="w-4 h-4" />
                <span className="text-sm">Overall Score</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(analysisData.metrics.paceConsistency)}`}>
                {analysisData.metrics.paceConsistency}%
              </div>
              <div className="text-sm text-gray-600">Pace Consistency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analysisData.metrics.fillerWords}</div>
              <div className="text-sm text-gray-600">Filler Words</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(analysisData.metrics.structureAdherence)}`}>
                {analysisData.metrics.structureAdherence}%
              </div>
              <div className="text-sm text-gray-600">Structure Adherence</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(analysisData.metrics.timeManagement)}`}>
                {analysisData.metrics.timeManagement}%
              </div>
              <div className="text-sm text-gray-600">Time Management</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Section Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Section Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisData.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{section.name}</span>
                  <span className={`font-bold ${getScoreColor(section.score)}`}>
                    {section.score}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Planned: {section.plannedTime}</span>
                  <span>Actual: {section.actualTime}</span>
                </div>
                <Progress 
                  value={section.score} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Strengths & Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Feedback Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {analysisData.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Areas for Improvement
              </h4>
              <ul className="space-y-1">
                {analysisData.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {t('analysis.goals')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Select goals to track your improvement over time
          </p>
          <div className="grid md:grid-cols-2 gap-3 mb-6">
            {analysisData.suggestedGoals.map((goal, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedGoals.includes(goal)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => toggleGoal(goal)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedGoals.includes(goal)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedGoals.includes(goal) && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{goal}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowProgressTracking(true)}
              disabled={selectedGoals.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('button.save')} Goals
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowProgressTracking(true)}
            >
              View Progress History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking */}
      {showProgressTracking && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('analysis.progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {progressData.map((session, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">{session.session}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Score</span>
                          <span className={getScoreColor(session.overallScore)}>
                            {session.overallScore}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Filler Words</span>
                          <span className="text-red-600">{session.fillerWords}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pace Score</span>
                          <span className={getScoreColor(session.paceScore)}>
                            {session.paceScore}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Progress Highlights</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Overall score improved by 13 points</li>
                  <li>• Filler words reduced by 40%</li>
                  <li>• Pace consistency improved by 12 points</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          {t('button.back')}
        </Button>
        <Button 
          onClick={onRestart}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {t('button.restart')}
        </Button>
      </div>
    </div>
  );
};

export default PostAnalysis;
