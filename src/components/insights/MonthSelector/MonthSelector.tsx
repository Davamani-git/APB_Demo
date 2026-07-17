import React, { useMemo, useState } from 'react';
import { TextField } from '@mui/material';
import { isMonthInFuture, isMonthValid } from '../../../utils/date.utils';
import { MIN_SUPPORTED_MONTH } from '../../../constants/insightsConstants';

export interface MonthSelectorProps {
  value: string;
  onChange: (month: string) => void;
  label?: string;
  disabled?: boolean;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ value, onChange, label = 'Month', disabled }) => {
  const [touched, setTouched] = useState(false);

  const { error, helperText } = useMemo(() => {
    if (!touched) return { error: false, helperText: '' };
    if (!isMonthValid(value)) {
      return { error: true, helperText: 'Enter a valid month (YYYY-MM).' };
    }
    if (isMonthInFuture(value)) {
      return { error: true, helperText: 'Month cannot be in the future.' };
    }
    if (value < MIN_SUPPORTED_MONTH) {
      return { error: true, helperText: `Month must be on or after ${MIN_SUPPORTED_MONTH}.` };
    }
    return { error: false, helperText: '' };
  }, [touched, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setTouched(true);
    if (!isMonthValid(next)) {
      return;
    }
    if (isMonthInFuture(next)) {
      return;
    }
    if (next < MIN_SUPPORTED_MONTH) {
      return;
    }
    onChange(next);
  };

  return (
    <TextField
      type="month"
      size="small"
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={() => setTouched(true)}
      error={error}
      helperText={helperText}
      disabled={disabled}
      inputProps={{
        'aria-label': 'Select month for spending summary',
        max: new Date().toISOString().slice(0, 7),
        min: MIN_SUPPORTED_MONTH
      }}
      sx={{
        bgcolor: 'rgba(255,255,255,0.9)',
        borderRadius: 1
      }}
    />
  );
};

export default MonthSelector;
