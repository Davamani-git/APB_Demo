export interface PayerRuleSet {
  id: string;
  payerName: string;
  version: string;
  effectiveDate: string;
  isActive: boolean;
  requirements: RuleRequirement[];
}

export interface RuleRequirement {
  name: string;
  type: string;
  mandatory: boolean;
  expirationThresholdDays?: number;
  validationRules?: string[];
}

export interface PrebuiltRuleSet {
  id: string;
  payerName: string;
  version: string;
  description: string;
  lastUpdated: string;
  isActivated: boolean;
  requirements: RuleRequirement[];
}