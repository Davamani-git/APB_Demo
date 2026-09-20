export interface Application {
  id: string;
  providerName: string;
  submissionDate: Date;
  overallStatus: string;
  priorityScore: number;
  riskScore: number;
  coordinatorName: string;
  payers: PayerStatus[];
}

export interface PayerStatus {
  payerId: string;
  payerName: string;
  status: string;
  ruleSetVersion: string;
  requirements: Requirement[];
}

export interface Requirement {
  name: string;
  status: string;
  expirationDate?: Date;
  recommendation?: string;
}