export const getCurrentMonth = (): string => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
};

export const isMonthValid = (value: string): boolean => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!regex.test(value)) return false;
  const [year, month] = value.split('-').map(Number);
  if (year < 1900 || year > 9999) return false;
  return month >= 1 && month <= 12;
};

export const isMonthInFuture = (value: string): boolean => {
  if (!isMonthValid(value)) return false;
  const [year, month] = value.split('-').map(Number);
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  return year > nowYear || (year === nowYear && month > nowMonth);
};

export const isMonthBeforeMin = (value: string, min: string): boolean => {
  if (!isMonthValid(value) || !isMonthValid(min)) return false;
  return value < min;
};
