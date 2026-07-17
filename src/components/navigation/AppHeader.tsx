import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MonthSelector from '../insights/MonthSelector/MonthSelector';
import { dashboardLayoutStyles } from '../../layouts/DashboardLayout/DashboardLayout.styles';

export interface AppHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ selectedMonth, onMonthChange, onMenuClick, showMenuButton }) => {
  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...dashboardLayoutStyles.headerGradient
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showMenuButton && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open navigation menu"
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
          Monthly Spend Insights
        </Typography>
        <Box sx={{ minWidth: 180, display: 'flex', justifyContent: 'flex-end' }}>
          <MonthSelector value={selectedMonth} onChange={onMonthChange} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
