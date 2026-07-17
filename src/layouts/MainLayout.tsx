import React, { useState } from 'react';
import AppShell from '@components/layout/AppShell';
import TopBar from '@components/layout/TopBar';
import SidebarNav from '@components/navigation/SidebarNav';
import { useUIStore } from '@state/uiStore';
import { useConsentStatus } from '@services/consent/useConsentStatus';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen] = useState(true);
  const selectedMonth = useUIStore((s) => s.selectedMonth) || '';
  const { data: consent } = useConsentStatus();

  return (
    <AppShell>
      <TopBar title="Monthly Spend Dashboard" currentMonth={selectedMonth || ''} consentStatus={consent?.status} />
      <div className="app-main">
        {sidebarOpen && (
          <SidebarNav
            items={[
              {
                label: 'Monthly Spend',
                icon: 'dashboard',
                path: '/insights/monthly-spend'
              }
            ]}
          />
        )}
        <main className="app-content" role="main">
          {children}
        </main>
      </div>
    </AppShell>
  );
};

export default MainLayout;
