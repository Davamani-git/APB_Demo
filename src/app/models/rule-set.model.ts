export interface RuleSet {
  id: string;
  payerId: string;
  payerName: string;
  version: string;
  effectiveDate: Date;
  endDate?: Date;
  isActive: boolean;
  requiredDocuments: RequiredDocument[];
  requiredDataFields: RequiredDataField[];
  createdBy: string;
  lastModified: Date;
}

export interface RequiredDocument {
  documentType: string;
  description?: string;
  isMandatory: boolean;
  expirationRequired: boolean;
}

export interface RequiredDataField {
  fieldName: string;
  fieldType: string;
  isMandatory: boolean;
  validationRule?: string;
  description?: string;
}