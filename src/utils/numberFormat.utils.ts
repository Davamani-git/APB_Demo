import { appConfig } from '../config/appConfig';

export function formatCurrency(value: number, currency?: string): string {
  const curr = currency || appConfig.defaultCurrency;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${curr}`;
  }
}

export function formatNumber(value: number): string {
  try {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return String(value);
  }
}
