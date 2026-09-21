export interface EnrollmentApplication {
  id: string;
  providerName: string;
  overallStatus: string;
  priority: string;
  targetPayers: string[];
  daysUntilExpiration: number;
  payerRequirements: PayerRequirement[];
  createdDate: string;
  lastUpdated: string;
}

export interface PayerRequirement {
  payerName: string;
  payerStatus: string;
  requirements: Requirement[];
  deficiencies?: RequirementDeficiency[];
}

export interface Requirement {
  requirementName: string;
  requirementType: string;
  status: string;
  expirationDate?: string;
  details: string;
}

export interface RequirementDeficiency {
  requirementName: string;
  issue: string;
  expirationDate?: string;
  outreachRecommendations: string[];
}