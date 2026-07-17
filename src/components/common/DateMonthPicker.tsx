import { FC, useMemo } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { envConfig } from "../../config/env";
import { isMonthInRange, isValidMonth } from "../../utils/dateUtils";

interface DateMonthPickerProps {
  value: string;
  minMonth?: string;
  maxMonth?: string;
  onChange: (value: string) => void;
}

function getMonthOptions(minMonth: string, maxMonth: string): string[] {
  const [minYearStr, minMonthStr] = minMonth.split("-");
  const [maxYearStr, maxMonthStr] = maxMonth.split("-");

  const minYear = Number(minYearStr);
  const minM = Number(minMonthStr);
  const maxYear = Number(maxYearStr);
  const maxM = Number(maxMonthStr);

  const options: string[] = [];
  for (let year = minYear; year <= maxYear; year += 1) {
    const startM = year === minYear ? minM : 1;
    const endM = year === maxYear ? maxM : 12;
    for (let m = startM; m <= endM; m += 1) {
      const month = `${m}`.padStart(2, "0");
      options.push(`${year}-${month}`);
    }
  }
  options.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  return options;
}

export const DateMonthPicker: FC<DateMonthPickerProps> = ({
  value,
  minMonth,
  maxMonth,
  onChange
}) => {
  const effectiveMin = minMonth ?? envConfig.minMonth;
  const effectiveMax = maxMonth ?? envConfig.maxMonth;

  const options = useMemo(() => getMonthOptions(effectiveMin, effectiveMax), [effectiveMin, effectiveMax]);

  const error = value !== "" && (!isValidMonth(value) || !isMonthInRange(value));

  return (
    <Box className="min-w-[180px]">
      <TextField
        select
        size="small"
        fullWidth
        label="Month"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (isValidMonth(newValue) && isMonthInRange(newValue)) {
            onChange(newValue);
          }
        }}
        error={error}
        helperText={error ? "Select a valid month within the allowed range" : ""}
        inputProps={{ "aria-label": "Select month" }}
      >
        {options.map((month) => (
          <MenuItem key={month} value={month}>
            {month}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
