import React from 'react';
import { Box } from '@mui/material';
import { MonthSelector } from '../insights/MonthSelector/MonthSelector';

interface AppHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ selectedMonth, onMonthChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <MonthSelector value={selectedMonth} onChange={onMonthChange} />
    </Box>
  );
};
