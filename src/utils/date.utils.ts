export const isMonthValid = (month: string): boolean => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!regex.test(month)) {
    return false;
  }
  const [year, m] = month.split('-').map(Number);
  if (year < 1900 || year > 9999) return false;
  return m >= 1 && m <= 12;
};

export const isMonthInFuture = (month: string): boolean => {
  if (!isMonthValid(month)) return false;
  const [year, m] = month.split('-').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return year > currentYear || (year === currentYear && m > currentMonth);
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
