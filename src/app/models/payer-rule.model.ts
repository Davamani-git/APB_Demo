export interface PayerRule {
  id: string;
  payerName: string;
  version: string;
  effectiveDate: Date;
  endDate?: Date;
  isActive: boolean;
  requiredDocuments: string[];
  requiredDataFields: string[];
  expirationThreshold: number;
}