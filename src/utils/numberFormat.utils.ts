import { appConfig } from '../config/appConfig';

export const formatCurrency = (value: number, currency?: string): string => {
  const code = currency || appConfig.defaultCurrency;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${code}`;
  }
};

export const formatInteger = (value: number): string => {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value);
};
