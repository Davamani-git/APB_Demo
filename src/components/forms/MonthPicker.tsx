import React, { useMemo, useState } from 'react';
import { getSelectableMonths, isValidYearMonth } from '@shared/dateUtils';
import Icon from '@components/common/Icon';
import clsx from 'clsx';

interface MonthPickerProps {
  value: string;
  minMonth?: string;
  maxMonth?: string;
  onChange: (newValue: string) => void;
}

const MonthPicker: React.FC<MonthPickerProps> = ({ value, minMonth, maxMonth, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const months = useMemo(() => getSelectableMonths(minMonth, maxMonth), [minMonth, maxMonth]);

  const handleChange = (newValue: string) => {
    if (!isValidYearMonth(newValue)) {
      setError('Select a valid month.');
      return;
    }
    setError(null);
    onChange(newValue);
    setIsOpen(false);
  };

  const selectedLabel = useMemo(() => {
    const [year, month] = value.split('-').map((v) => Number(v));
    if (!year || !month) return '';
    const d = new Date(year, month - 1, 1);
    return d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
  }, [value]);

  return (
    <div className="relative inline-block text-left">
      <label className="block text-xs font-semibold text-gray-700 mb-1">Month</label>
      <button
        type="button"
        className={clsx(
          'inline-flex w-48 justify-between items-center rounded-md border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-danger-500' : 'border-gray-200'
        )}
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel || 'Select month'}</span>
        <Icon name="calendar" size={18} className="text-gray-500" />
      </button>
      {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
      {isOpen && (
        <ul
          className="absolute right-0 mt-1 max-h-64 w-56 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 z-20"
          role="listbox"
        >
          {months.map((m) => (
            <li
              key={m.value}
              role="option"
              aria-selected={m.value === value}
              className={clsx(
                'cursor-pointer select-none px-3 py-2 flex items-center justify-between',
                m.value === value ? 'bg-primary-50 text-primary-700' : 'text-gray-800 hover:bg-gray-50'
              )}
              onClick={() => handleChange(m.value)}
            >
              <span>{m.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MonthPicker;
