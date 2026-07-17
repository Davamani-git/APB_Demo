import { isValidYearMonth } from './dateUtils';

export function validateMonthSelection(month: string): string | null {
  if (!isValidYearMonth(month)) {
    return 'Month must be in the format YYYY-MM.';
  }
  return null;
}
