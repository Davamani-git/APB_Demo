import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppHeader } from '../../components/navigation/AppHeader';
import { Sidebar } from '../../components/navigation/Sidebar';
import { useMonthlySpendSummaryPageStateContext } from '../../pages/MonthlySpendSummaryPage/MonthlySpendSummaryPage.state';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 260;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const { selectedMonth, setSelectedMonth } = useMonthlySpendSummaryPageStateContext();

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const drawer = <Sidebar />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #0f172a, #1e293b)'
        }}
      >
        <Toolbar>
          {!isSmUp && (
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 500 }}>
            Monthly Spend Insights
          </Typography>
          <AppHeader selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar navigation"
      >
        <Drawer
          variant={isSmUp ? 'permanent' : 'temporary'}
          open={isSmUp ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#020617',
              color: '#e5e7eb'
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
