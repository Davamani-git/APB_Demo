export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export type ConsentStatusValue = 'granted' | 'revoked' | 'denied' | 'unknown';

export interface ConsentStatus {
  feature: string;
  status: ConsentStatusValue;
  consentId?: string;
  updatedAt?: string;
}
