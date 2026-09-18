export interface PayerRuleSet {
  id: string;
  payerId: string;
  payerName: string;
  version: string;
  effectiveDate: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  requirements: Requirement[];
}

export interface Requirement {
  id: string;
  name: string;
  description: string;
  documentTypes: string[];
  mandatory: boolean;
  expirationThresholdDays?: number;
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  type: 'presence' | 'expiration' | 'custom';
  condition: string;
  errorMessage: string;
}

export interface SystemSettings {
  organizationId: string;
  defaultExpirationThresholdDays: number;
  documentTypeThresholds: { [key: string]: number };
  emailNotificationsEnabled: boolean;
  weeklyDigestDay: string;
  lastUpdated: string;
  updatedBy: string;
}