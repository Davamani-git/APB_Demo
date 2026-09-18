export interface Application {
  id: string;
  providerName: string;
  providerNPI: string;
  applicationType: 'New Enrollment' | 'Re-Credentialing';
  coordinatorId: string;
  coordinatorName: string;
  startDate: string;
  overallStatus: ApplicationStatus;
  payerStatuses: PayerStatus[];
  documents: Document[];
  lastUpdated: string;
}

export interface PayerStatus {
  payerId: string;
  payerName: string;
  status: ApplicationStatus;
  requirements: RequirementStatus[];
  ruleSetVersion: string;
}

export interface RequirementStatus {
  requirementId: string;
  requirementName: string;
  status: ApplicationStatus;
  rationale: string;
  relatedDocuments: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  uploadedBy: string;
  expirationDate?: string;
  status: 'Valid' | 'Expired' | 'Expiring Soon';
}

export type ApplicationStatus = 'Ready to Submit' | 'Incomplete' | 'Expiring Soon';

export interface EvaluationResult {
  applicationId: string;
  evaluationTimestamp: string;
  overallStatus: ApplicationStatus;
  payerResults: PayerEvaluationResult[];
  calculationTimeMs: number;
}

export interface PayerEvaluationResult {
  payerId: string;
  status: ApplicationStatus;
  requirementResults: RequirementEvaluationResult[];
}

export interface RequirementEvaluationResult {
  requirementId: string;
  status: ApplicationStatus;
  rationale: string;
}