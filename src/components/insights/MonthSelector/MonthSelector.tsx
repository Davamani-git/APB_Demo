import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { MIN_SUPPORTED_MONTH } from '../../../constants/insightsConstants';
import { isMonthValid, isMonthInFuture, isMonthBeforeMin } from '../../../utils/date.utils';

interface MonthSelectorProps {
  value: string;
  onChange: (month: string) => void;
  disabled?: boolean;
  label?: string;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ value, onChange, disabled, label }) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (!isMonthValid(newValue)) {
      setError('Enter a valid month (YYYY-MM).');
      return;
    }

    if (isMonthInFuture(newValue)) {
      setError('Month cannot be in the future.');
      return;
    }

    if (isMonthBeforeMin(newValue, MIN_SUPPORTED_MONTH)) {
      setError(`Month must be after ${MIN_SUPPORTED_MONTH}.`);
      return;
    }

    setError(null);
    onChange(newValue);
  };

  return (
    <TextField
      type="month"
      size="small"
      label={label ?? 'Month'}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      error={Boolean(error)}
      helperText={error ?? ' '}
      inputProps={{ 'aria-label': 'Select month for spending summary' }}
    />
  );
};
