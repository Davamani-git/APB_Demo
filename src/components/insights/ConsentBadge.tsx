import React from 'react';
import Icon from '@components/common/Icon';

interface ConsentBadgeProps {
  status: 'granted' | 'revoked' | 'unknown' | 'denied';
}

const ConsentBadge: React.FC<ConsentBadgeProps> = ({ status }) => {
  let label = '';
  let color = '';
  let icon: 'info' | 'warning' | 'error';

  switch (status) {
    case 'granted':
      label = 'Insights consent granted';
      color = 'bg-secondary-50 text-secondary-700 border-secondary-500';
      icon = 'info';
      break;
    case 'revoked':
    case 'denied':
      label = 'Insights consent revoked';
      color = 'bg-danger-50 text-danger-700 border-danger-500';
      icon = 'error';
      break;
    case 'unknown':
    default:
      label = 'Insights consent unknown';
      color = 'bg-warning-50 text-warning-700 border-warning-500';
      icon = 'warning';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      <Icon name={icon} size={14} />
      {label}
    </span>
  );
};

export default ConsentBadge;
