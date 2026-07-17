import React, { useEffect, useRef } from 'react';
import Icon from '@components/common/Icon';

interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="flex flex-col items-center justify-center py-10 text-center outline-none"
      aria-live="polite"
    >
      <Icon name="info" size={32} className="text-gray-400 mb-3" />
      <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
      {description && <p className="text-sm text-gray-600 max-w-md">{description}</p>}
    </div>
  );
};

export default EmptyState;
