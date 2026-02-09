import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  actions?: React.ReactNode; // Support both for compatibility
  backUrl?: string;
  onBack?: () => void;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  actions,
  backUrl,
  onBack,
  className = ''
}) => {
  const navigate = useNavigate();
  const finalAction = action || actions;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  const showBackButton = backUrl || onBack;

  return (
    <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8 ${className}`}>
      <div className="flex items-start gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mt-1 -ml-2 text-text-muted hover:text-text-primary"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}
        
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-text-secondary mt-1 text-sm">
              {description}
            </p>
          )}
        </div>
      </div>

      {finalAction && (
        <div className="flex items-center gap-3 self-start md:self-auto">
          {finalAction}
        </div>
      )}
    </div>
  );
};
