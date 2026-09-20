export interface ReadinessEvaluation {
  applicationId: string;
  evaluationDate: Date;
  overallStatus: string;
  priorityScore: number;
  riskScore: number;
  payerEvaluations: PayerEvaluation[];
}

export interface PayerEvaluation {
  payerId: string;
  payerName: string;
  status: string;
  ruleSetVersion: string;
  requirementResults: RequirementResult[];
}

export interface RequirementResult {
  requirementName: string;
  status: string;
  expirationDate?: Date;
  recommendation?: string;
}