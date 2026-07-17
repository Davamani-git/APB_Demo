import { envConfig } from "../config/env";

export function getCurrentMonth(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function getDefaultMonth(): string {
  return getCurrentMonth();
}

export function isValidMonth(month: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
}

export function isMonthInRange(month: string): boolean {
  const { minMonth, maxMonth } = envConfig;
  return month >= minMonth && month <= maxMonth;
}
