export function isValidYearMonth(input: string): boolean {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!regex.test(input)) return false;
  const [year, month] = input.split('-').map((v) => Number(v));
  if (!year || !month) return false;
  const date = new Date(year, month - 1, 1);
  return !isNaN(date.getTime());
}

export function parseYearMonth(input: string): Date | null {
  if (!isValidYearMonth(input)) return null;
  const [year, month] = input.split('-').map((v) => Number(v));
  return new Date(year, month - 1, 1);
}

export function formatYearMonthLabel(input: string): string {
  const date = parseYearMonth(input);
  if (!date) return input;
  return date.toLocaleString(undefined, { month: 'short', year: 'numeric' });
}

export function getSelectableMonths(minMonth?: string, maxMonth?: string): { value: string; label: string }[] {
  const result: { value: string; label: string }[] = [];
  const now = maxMonth ? parseYearMonth(maxMonth) || new Date() : new Date();
  const min = minMonth ? parseYearMonth(minMonth) || new Date(now.getFullYear(), now.getMonth() - 35, 1) : new Date(now.getFullYear(), now.getMonth() - 35, 1);

  const cursor = new Date(now.getFullYear(), now.getMonth(), 1);

  while (cursor >= min) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, '0');
    const value = `${year}-${month}`;
    result.push({ value, label: formatYearMonthLabel(value) });
    cursor.setMonth(cursor.getMonth() - 1);
  }

  return result;
}
