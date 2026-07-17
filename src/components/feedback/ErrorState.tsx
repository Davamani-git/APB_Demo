import React, { useEffect, useRef } from 'react';
import Button from '@components/common/Button';
import Icon from '@components/common/Icon';

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, description, onRetry }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="flex flex-col items-center justify-center py-10 text-center outline-none"
      aria-live="assertive"
    >
      <Icon name="error" size={32} className="text-danger-500 mb-3" />
      <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
      {description && <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>}
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
