import { appConfig } from '../config/appConfig';

export const formatCurrency = (value: number, currency?: string): string => {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || appConfig.defaultCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(value);
  } catch {
    return `${value.toFixed(2)} ${currency || appConfig.defaultCurrency}`;
  }
};

export const formatNumber = (value: number): string => {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0
    });
    return formatter.format(value);
  } catch {
    return String(value);
  }
};
