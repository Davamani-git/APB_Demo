import React from 'react';
import ConsentBadge from '@components/insights/ConsentBadge';

interface TopBarProps {
  title: string;
  currentMonth: string;
  consentStatus?: 'granted' | 'revoked' | 'unknown' | 'denied';
}

const TopBar: React.FC<TopBarProps> = ({ title, currentMonth, consentStatus }) => {
  const monthLabel = new Date(currentMonth + '-01');
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
  const label = isNaN(monthLabel.getTime()) ? currentMonth : formatter.format(monthLabel);

  return (
    <header className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">Viewing: {label}</p>
      </div>
      <div className="flex items-center gap-4">
        {consentStatus && <ConsentBadge status={consentStatus} />}
        <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary-600">
          CC
        </div>
      </div>
    </header>
  );
};

export default TopBar;
