import React from 'react';
import { Box, Typography } from '@mui/material';
import { MonthSelector } from '../insights/MonthSelector/MonthSelector';

interface AppHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ selectedMonth, onMonthChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
        Monthly Spend Insights
      </Typography>
      <MonthSelector value={selectedMonth} onChange={onMonthChange} />
    </Box>
  );
};
