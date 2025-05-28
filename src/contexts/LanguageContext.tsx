
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Landing Page
    'app.title': 'فوكا AI',
    'app.subtitle': 'مدربك الذكي للعروض التقديمية',
    'app.description': 'خطط، قدم، وحسن من عروضك التقديمية مع الذكاء الاصطناعي',
    'button.getStarted': 'ابدأ الآن',
    'button.selectLanguage': 'اختر اللغة',
    
    // Phase Navigation
    'phase.planning': 'التخطيط',
    'phase.live': 'العرض المباشر',
    'phase.analysis': 'التحليل',
    
    // Pre-Session Planning
    'planning.title': 'تخطيط العرض التقديمي',
    'planning.upload': 'ارفع ملفك أو اكتب محتوى العرض',
    'planning.chat': 'أضف تعليمات إضافية',
    'planning.analyze': 'تحليل بالذكاء الاصطناعي',
    'planning.structure': 'الهيكل المقترح',
    'planning.agree': 'موافق على الهيكل',
    
    // Live Presentation
    'live.title': 'العرض المباشر',
    'live.start': 'ابدأ العرض',
    'live.stop': 'أوقف العرض',
    'live.feedback.pace': 'السرعة مناسبة',
    'live.feedback.fast': 'السرعة سريعة جداً',
    'live.feedback.slow': 'السرعة بطيئة جداً',
    'live.feedback.filler': 'كلمة حشو',
    'live.feedback.structure': 'خارج عن الموضوع',
    
    // Post Analysis
    'analysis.title': 'تحليل العرض',
    'analysis.performance': 'الأداء العام',
    'analysis.goals': 'أهداف التحسين',
    'analysis.progress': 'تتبع التقدم',
    
    // Common
    'button.next': 'التالي',
    'button.back': 'السابق',
    'button.save': 'حفظ',
    'button.restart': 'إعادة البدء',
  },
  en: {
    // Landing Page
    'app.title': 'Voca AI',
    'app.subtitle': 'Your AI-Powered Speaking Coach',
    'app.description': 'Plan, deliver, and improve your presentations with artificial intelligence',
    'button.getStarted': 'Get Started',
    'button.selectLanguage': 'Select Language',
    
    // Phase Navigation
    'phase.planning': 'Planning',
    'phase.live': 'Live Mode',
    'phase.analysis': 'Analysis',
    
    // Pre-Session Planning
    'planning.title': 'Presentation Planning',
    'planning.upload': 'Upload your file or enter presentation content',
    'planning.chat': 'Add additional instructions',
    'planning.analyze': 'AI Analysis',
    'planning.structure': 'Suggested Structure',
    'planning.agree': 'Agree to Structure',
    
    // Live Presentation
    'live.title': 'Live Presentation',
    'live.start': 'Start Presentation',
    'live.stop': 'Stop Presentation',
    'live.feedback.pace': 'Good pace',
    'live.feedback.fast': 'Too fast',
    'live.feedback.slow': 'Too slow',
    'live.feedback.filler': 'Filler word',
    'live.feedback.structure': 'Off-topic',
    
    // Post Analysis
    'analysis.title': 'Presentation Analysis',
    'analysis.performance': 'Overall Performance',
    'analysis.goals': 'Improvement Goals',
    'analysis.progress': 'Progress Tracking',
    
    // Common
    'button.next': 'Next',
    'button.back': 'Back',
    'button.save': 'Save',
    'button.restart': 'Restart',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const isRTL = language === 'ar';

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
