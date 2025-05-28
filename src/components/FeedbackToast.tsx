
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedbackToastProps {
  type: 'pace-fast' | 'pace-slow' | 'filler' | 'structure' | 'good';
  message: string;
  onDismiss: () => void;
}

const FeedbackToast = ({ type, message, onDismiss }: FeedbackToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const getTypeStyles = () => {
    switch (type) {
      case 'pace-fast':
        return {
          icon: Clock,
          bgColor: 'bg-orange-50 border-orange-200',
          iconColor: 'text-orange-600',
          textColor: 'text-orange-800'
        };
      case 'pace-slow':
        return {
          icon: Clock,
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800'
        };
      case 'filler':
        return {
          icon: MessageSquare,
          bgColor: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800'
        };
      case 'structure':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800'
        };
      case 'good':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-800'
        };
      default:
        return {
          icon: CheckCircle,
          bgColor: 'bg-gray-50 border-gray-200',
          iconColor: 'text-gray-600',
          textColor: 'text-gray-800'
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <Card className={`
      ${styles.bgColor} border-2 shadow-lg transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      hover:scale-105 min-w-[280px] max-w-[320px]
    `}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`${styles.textColor} font-medium text-sm leading-relaxed`}>
              {message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className={`${styles.textColor} hover:bg-white/50 h-6 w-6 p-0 flex-shrink-0`}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackToast;
