import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { MIN_SUPPORTED_MONTH } from '../../../constants/insightsConstants';
import { isMonthInFuture, isMonthValid } from '../../../utils/date.utils';

interface MonthSelectorProps {
  value: string;
  onChange: (month: string) => void;
  disabled?: boolean;
  label?: string;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  value,
  onChange,
  disabled,
  label
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const next = event.target.value;

    if (!isMonthValid(next)) {
      setError('Enter a valid month (YYYY-MM).');
      return;
    }

    if (isMonthInFuture(next)) {
      setError('Month cannot be in the future.');
      return;
    }

    if (next < MIN_SUPPORTED_MONTH) {
      setError(`Month must be after ${MIN_SUPPORTED_MONTH}.`);
      return;
    }

    setError(null);
    onChange(next);
  };

  return (
    <TextField
      size="small"
      type="month"
      label={label ?? 'Month'}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      error={!!error}
      helperText={error ?? ' '}
      inputProps={{
        'aria-label': 'Select month for spend summary'
      }}
    />
  );
};
