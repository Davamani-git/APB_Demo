import { AxiosError } from "axios";
import { ApiErrorResponse } from "../models/common";

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const status = axiosError.response?.status;
  const code = axiosError.response?.data?.errorCode;

  if (status === 403 && code === "CONSENT_REQUIRED") {
    return "Spending insights are not available because consent has not been granted.";
  }

  if (status === 400 && code === "INVALID_MONTH") {
    return "Month must be in format YYYY-MM and within the allowed range.";
  }

  return "Monthly summary is temporarily unavailable. Please try again later.";
}
