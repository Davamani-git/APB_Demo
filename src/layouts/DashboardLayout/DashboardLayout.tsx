import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import AppHeader from '../../components/navigation/AppHeader';
import Sidebar from '../../components/navigation/Sidebar';
import ResponsiveContainer from '../../components/layout/ResponsiveContainer';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const drawerWidth = 260;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, selectedMonth, onMonthChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        onMenuClick={handleDrawerToggle}
        showMenuButton={isMobile}
      />
      <Sidebar
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        width={drawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { sm: `${drawerWidth}px` },
          mt: 8,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
