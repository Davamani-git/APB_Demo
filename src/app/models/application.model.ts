export interface Application {
  id: string;
  applicationId: string;
  providerName: string;
  coordinator: string;
  submissionDate: Date;
  targetPayers: string[];
  overallStatus: ApplicationStatus;
  priorityScore: number;
  payerRequirements: PayerRequirement[];
  documents: Document[];
  dataFields: DataField[];
}

export type ApplicationStatus = 'Ready to Submit' | 'Incomplete' | 'Expiring Soon';

export interface PayerRequirement {
  payerName: string;
  status: ApplicationStatus;
  documents: RequirementItem[];
  dataFields: RequirementItem[];
}

export interface RequirementItem {
  name: string;
  status: 'Present & Valid' | 'Missing' | 'Expired' | 'Expiring Soon';
  expirationDate?: Date;
  value?: string;
  recommendation?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  expirationDate?: Date;
}

export interface DataField {
  name: string;
  value: string;
  required: boolean;
}