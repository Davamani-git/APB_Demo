import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'default' | 'kpi' | 'highlight';
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, variant = 'default', className }) => {
  return (
    <section
      className={clsx(
        'bg-white rounded-md shadow-card p-4 md:p-6 flex flex-col',
        variant === 'kpi' && 'border border-gray-100',
        variant === 'highlight' && 'border border-primary-500 shadow-card-hover',
        className
      )}
    >
      {(title || subtitle) && (
        <header className="mb-3">
          {title && <h4 className="text-sm font-semibold text-gray-900">{title}</h4>}
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </header>
      )}
      <div className="flex-1 flex flex-col">{children}</div>
    </section>
  );
};

export default Card;
