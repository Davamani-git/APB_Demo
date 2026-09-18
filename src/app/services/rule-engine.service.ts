import { Injectable } from '@angular/core';
import { Application, ApplicationStatus, PayerStatus, RequirementStatus, EvaluationResult } from '../models/application.model';
import { PayerRuleSet, Requirement } from '../models/rule.model';

@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {
  constructor() {}

  evaluateApplication(
    application: Application,
    ruleSets: PayerRuleSet[]
  ): EvaluationResult {
    const startTime = Date.now();
    const payerResults = application.payerStatuses.map(payerStatus => {
      const ruleSet = ruleSets.find(rs => rs.payerId === payerStatus.payerId && rs.isActive);
      if (!ruleSet) {
        return {
          payerId: payerStatus.payerId,
          status: 'Incomplete' as ApplicationStatus,
          requirementResults: []
        };
      }

      const requirementResults = ruleSet.requirements.map(req => 
        this.evaluateRequirement(req, application)
      );

      const payerStatusResult = this.determinePayerStatus(requirementResults);

      return {
        payerId: payerStatus.payerId,
        status: payerStatusResult,
        requirementResults
      };
    });

    const overallStatus = this.determineOverallStatus(payerResults);
    const calculationTimeMs = Date.now() - startTime;

    return {
      applicationId: application.id,
      evaluationTimestamp: new Date().toISOString(),
      overallStatus,
      payerResults,
      calculationTimeMs
    };
  }

  private evaluateRequirement(
    requirement: Requirement,
    application: Application
  ): RequirementEvaluationResult {
    const relatedDocuments = application.documents.filter(doc =>
      requirement.documentTypes.includes(doc.type)
    );

    if (relatedDocuments.length === 0) {
      return {
        requirementId: requirement.id,
        status: 'Incomplete',
        rationale: `Missing required document type(s): ${requirement.documentTypes.join(', ')}`
      };
    }

    const expiredDocs = relatedDocuments.filter(doc => doc.status === 'Expired');
    if (expiredDocs.length > 0) {
      return {
        requirementId: requirement.id,
        status: 'Incomplete',
        rationale: `Document(s) expired: ${expiredDocs.map(d => d.name).join(', ')}`
      };
    }

    const expiringDocs = relatedDocuments.filter(doc => doc.status === 'Expiring Soon');
    if (expiringDocs.length > 0) {
      return {
        requirementId: requirement.id,
        status: 'Expiring Soon',
        rationale: `Document(s) expiring soon: ${expiringDocs.map(d => d.name).join(', ')}`
      };
    }

    return {
      requirementId: requirement.id,
      status: 'Ready to Submit',
      rationale: 'All required documents are present and valid'
    };
  }

  private determinePayerStatus(requirementResults: RequirementEvaluationResult[]): ApplicationStatus {
    const hasIncomplete = requirementResults.some(r => r.status === 'Incomplete');
    if (hasIncomplete) return 'Incomplete';

    const hasExpiring = requirementResults.some(r => r.status === 'Expiring Soon');
    if (hasExpiring) return 'Expiring Soon';

    return 'Ready to Submit';
  }

  private determineOverallStatus(payerResults: any[]): ApplicationStatus {
    const hasIncomplete = payerResults.some(p => p.status === 'Incomplete');
    if (hasIncomplete) return 'Incomplete';

    const hasExpiring = payerResults.some(p => p.status === 'Expiring Soon');
    if (hasExpiring) return 'Expiring Soon';

    return 'Ready to Submit';
  }
}

interface RequirementEvaluationResult {
  requirementId: string;
  status: ApplicationStatus;
  rationale: string;
}