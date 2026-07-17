import React from 'react';
import { Squares2X2Icon, CalendarDaysIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, InformationCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, HomeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export type IconName =
  | 'dashboard'
  | 'calendar'
  | 'trendUp'
  | 'trendDown'
  | 'info'
  | 'warning'
  | 'error'
  | 'home';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color, className }) => {
  const style: React.CSSProperties = { width: size, height: size, color };

  const iconClass = clsx('inline-block', className);

  switch (name) {
    case 'dashboard':
      return <Squares2X2Icon style={style} className={iconClass} />;
    case 'calendar':
      return <CalendarDaysIcon style={style} className={iconClass} />;
    case 'trendUp':
      return <ArrowTrendingUpIcon style={style} className={iconClass} />;
    case 'trendDown':
      return <ArrowTrendingDownIcon style={style} className={iconClass} />;
    case 'info':
      return <InformationCircleIcon style={style} className={iconClass} />;
    case 'warning':
      return <ExclamationTriangleIcon style={style} className={iconClass} />;
    case 'error':
      return <ExclamationCircleIcon style={style} className={iconClass} />;
    case 'home':
      return <HomeIcon style={style} className={iconClass} />;
    default:
      return null;
  }
};

export default Icon;
