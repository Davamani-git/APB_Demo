import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10" role="status" aria-live="polite">
      <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm text-gray-600">{message || 'Loading insights...'}</p>
    </div>
  );
};

export default Loader;
