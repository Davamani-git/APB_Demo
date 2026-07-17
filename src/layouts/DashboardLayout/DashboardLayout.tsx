import React, { useState } from 'react';
import { Box, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, DrawerStyled, Main, ContentWrapper } from './DashboardLayout.styles';
import { AppHeader } from '../../components/navigation/AppHeader';
import { Sidebar } from '../../components/navigation/Sidebar';
import { ResponsiveContainer } from '../../components/layout/ResponsiveContainer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, selectedMonth, onMonthChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open navigation menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <AppHeader selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
        </Toolbar>
      </AppBar>
      <DrawerStyled
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <Sidebar onNavigate={handleDrawerToggle} />
      </DrawerStyled>
      <DrawerStyled
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        <Sidebar />
      </DrawerStyled>
      <Main component="div">
        <ContentWrapper>
          <ResponsiveContainer>{children}</ResponsiveContainer>
        </ContentWrapper>
      </Main>
    </Box>
  );
};
