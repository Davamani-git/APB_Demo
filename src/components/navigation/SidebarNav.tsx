import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@components/common/Icon';
import clsx from 'clsx';

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}

interface SidebarNavProps {
  items: NavItem[];
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items }) => {
  return (
    <nav className="hidden md:flex md:flex-col w-60 bg-white border-r border-gray-100 shadow-sm">
      <div className="h-14 flex items-center px-4 border-b border-gray-100 text-primary-600 font-semibold text-lg">
        Spend Insights
      </div>
      <ul className="flex-1 py-4 space-y-1">
        {items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700'
                )
              }
            >
              <Icon name={item.icon as any} size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
