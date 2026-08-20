const { expect } = require('@playwright/test');

exports.PolicyEnginePage = class PolicyEnginePage {
  constructor(page) {
    this.page = page;
    this.policyIdInput = page.locator('#policy_id');
    this.riskBandInput = page.locator('#risk_band');
    this.thresholdMinInput = page.locator('#threshold_min');
    this.thresholdMaxInput = page.locator('#threshold_max');
    this.actionInput = page.locator('#action');
    this.alertPriorityInput = page.locator('#alert_priority');
    this.interventionInput = page.locator('#intervention');
    this.savePolicyButton = page.locator('button[data-testid="save-policy"]');
    this.decisionIdInput = page.locator('#decision_id');
    this.transactionIdInput = page.locator('#transaction_id');
    this.riskScoreInput = page.locator('#risk_score');
    this.riskBandDecisionInput = page.locator('#risk_band_decision');
    this.accountIdInput = page.locator('#account_id');
    this.amountInput = page.locator('#amount');
    this.merchantInput = page.locator('#merchant');
    this.customerProfileInput = page.locator('#customer_profile');
    this.transactionLocationInput = page.locator('#transaction_location');
    this.customerTravelHistoryInput = page.locator('#customer_travel_history');
    this.submitDecisionButton = page.locator('button[data-testid="submit-decision"]');
    this.mapActionButton = page.locator('button[data-testid="map-action"]');
    this.policyEngineStatusDisplay = page.locator('[data-testid="policy-engine-status"]');
    this.mappedActionDisplay = page.locator('[data-testid="mapped-action"]');
    this.requiresNotificationDisplay = page.locator('[data-testid="requires-notification"]');
    this.requiresAuthenticationDisplay = page.locator('[data-testid="requires-authentication"]');
    this.transactionDecisionDisplay = page.locator('[data-testid="transaction-decision"]');
    this.alertSeverityDisplay = page.locator('[data-testid="alert-severity"]');
    this.alertIdDisplay = page.locator('[data-testid="alert-id"]');
    this.alertStatusDisplay = page.locator('[data-testid="alert-status"]');
    this.authenticationLevelDisplay = page.locator('[data-testid="authentication-level"]');
    this.transactionStatusDisplay = page.locator('[data-testid="transaction-status"]');
    this.auditIdDisplay = page.locator('[data-testid="audit-id"]');
    this.auditTimestampDisplay = page.locator('[data-testid="audit-timestamp"]');
    this.requiresAlertDisplay = page.locator('[data-testid="requires-alert"]');
    this.requiresHoldDisplay = page.locator('[data-testid="requires-hold"]');
    this.alertCreatedDisplay = page.locator('[data-testid="alert-created"]');
    this.additionalAuthDisplay = page.locator('[data-testid="additional-auth"]');
    this.geographicBlockDisplay = page.locator('[data-testid="geographic-block"]');
    this.travelContextAppliedDisplay = page.locator('[data-testid="travel-context-applied"]');
    this.geographicFrictionDisplay = page.locator('[data-testid="geographic-friction"]');
    this.customerContextDisplay = page.locator('[data-testid="customer-context"]');
    this.policyStatusInput = page.locator('#policy_status');
    this.errorLogDisplay = page.locator('[data-testid="error-log"]');
    this.failSafeActionDisplay = page.locator('[data-testid="fail-safe-action"]');
    this.failSafePolicyDisplay = page.locator('[data-testid="fail-safe-policy"]');
    this.errorIdDisplay = page.locator('[data-testid="error-id"]');
    this.errorTypeDisplay = page.locator('[data-testid="error-type"]');
    this.failSafeAppliedDisplay = page.locator('[data-testid="fail-safe-applied"]');
    this.policyErrorDisplay = page.locator('[data-testid="policy-error"]');
    this.incorrectApprovalDisplay = page.locator('[data-testid="incorrect-approval"]');
    this.configErrorDisplay = page.locator('[data-testid="config-error"]');
    this.invalidActionDisplay = page.locator('[data-testid="invalid-action"]');
  }

  async navigate() {
    await this.page.goto('/policy-engine');
    await expect(this.page).toHaveTitle(/Policy Engine/i);
  }

  async configurePolicyMapping(policyConfig) {
    await expect(this.policyIdInput).toBeVisible();
    await this.policyIdInput.fill(policyConfig.policy_id);
    await this.riskBandInput.fill(policyConfig.risk_band);
    await this.thresholdMinInput.fill(policyConfig.threshold_min.toString());
    await this.thresholdMaxInput.fill(policyConfig.threshold_max.toString());
    await this.actionInput.fill(policyConfig.action);
    
    if (policyConfig.alert_priority) {
      await this.alertPriorityInput.fill(policyConfig.alert_priority);
    }
    
    if (policyConfig.intervention) {
      await this.interventionInput.fill(policyConfig.intervention);
    }
    
    await this.savePolicyButton.click();
    await expect(this.page.locator('[data-testid="policy-saved-message"]')).toBeVisible();
  }

  async verifyPolicyConfiguration(policyConfig) {
    await expect(this.policyIdInput).toHaveValue(policyConfig.policy_id);
    await expect(this.riskBandInput).toHaveValue(policyConfig.risk_band);
    await expect(this.actionInput).toHaveValue(policyConfig.action);
  }

  async prepareRiskDecision(riskDecision) {
    await expect(this.decisionIdInput).toBeVisible();
    await this.decisionIdInput.fill(riskDecision.decision_id);
    await this.transactionIdInput.fill(riskDecision.transaction_id);
    await this.riskScoreInput.fill(riskDecision.risk_score.toString());
    await this.riskBandDecisionInput.fill(riskDecision.risk_band);
    await this.accountIdInput.fill(riskDecision.account_id);
    
    if (riskDecision.amount) {
      await this.amountInput.fill(riskDecision.amount.toString());
    }
    
    if (riskDecision.merchant) {
      await this.merchantInput.fill(riskDecision.merchant);
    }
    
    if (riskDecision.customer_profile) {
      await this.customerProfileInput.fill(riskDecision.customer_profile);
    }
    
    if (riskDecision.transaction_location) {
      await this.transactionLocationInput.fill(riskDecision.transaction_location);
    }
    
    if (riskDecision.customer_travel_history) {
      await this.customerTravelHistoryInput.fill(riskDecision.customer_travel_history);
    }
  }

  async verifyMediumRiskClassification(riskDecision) {
    await expect(this.riskBandDecisionInput).toHaveValue('medium');
    await expect(this.riskScoreInput).toHaveValue(riskDecision.risk_score.toString());
  }

  async verifyHighRiskClassification(riskDecision) {
    await expect(this.riskBandDecisionInput).toHaveValue('high');
    await expect(this.riskScoreInput).toHaveValue(riskDecision.risk_score.toString());
  }

  async verifyLowRiskClassification(riskDecision) {
    await expect(this.riskBandDecisionInput).toHaveValue('low');
    await expect(this.riskScoreInput).toHaveValue(riskDecision.risk_score.toString());
  }

  async verifyHighRiskRequiringPolicy(riskDecision) {
    await expect(this.riskBandDecisionInput).toHaveValue('high');
    await expect(this.riskScoreInput).toHaveValue(riskDecision.risk_score.toString());
  }

  async verifyLowRiskDespiteInternationalLocation(riskDecision) {
    await expect(this.riskBandDecisionInput).toHaveValue('low');
    await expect(this.transactionLocationInput).toHaveValue(riskDecision.transaction_location);
    await expect(this.customerProfileInput).toHaveValue('frequent_traveler');
  }

  async sendRiskDecisionToPolicyEngine(endpoint) {
    await expect(this.mapActionButton).toBeEnabled();
    await this.mapActionButton.click();
  }

  async verifyPolicyEngineReceivedDecision() {
    await expect(this.policyEngineStatusDisplay).toBeVisible({ timeout: 10000 });
    await expect(this.policyEngineStatusDisplay).toContainText(/received|processing|evaluating/i);
  }

  async verifyRiskScoreEvaluatedAgainstThreshold(riskScore, thresholdMin, thresholdMax) {
    await expect(this.policyEngineStatusDisplay).toContainText(/evaluated|threshold check/i);
    const scoreValue = await this.riskScoreInput.inputValue();
    expect(parseInt(scoreValue)).toBeGreaterThanOrEqual(thresholdMin);
    expect(parseInt(scoreValue)).toBeLessThanOrEqual(thresholdMax);
  }

  async verifyActionMapping(expectedMapping) {
    await expect(this.mappedActionDisplay).toBeVisible();
    await expect(this.mappedActionDisplay).toContainText(expectedMapping.mapped_action);
    
    if (expectedMapping.requires_notification !== undefined) {
      await expect(this.requiresNotificationDisplay).toContainText(expectedMapping.requires_notification.toString());
    }
    
    if (expectedMapping.requires_authentication) {
      await expect(this.requiresAuthenticationDisplay).toContainText(expectedMapping.requires_authentication);
    }
    
    if (expectedMapping.transaction_decision) {
      await expect(this.transactionDecisionDisplay).toContainText(expectedMapping.transaction_decision);
    }
    
    if (expectedMapping.alert_severity) {
      await expect(this.alertSeverityDisplay).toContainText(expectedMapping.alert_severity);
    }
  }

  async verifyApproveActionWithoutIntervention(expectedMapping) {
    await expect(this.mappedActionDisplay).toContainText('approve');
    await expect(this.requiresAlertDisplay).toContainText('false');
    await expect(this.requiresAuthenticationDisplay).toContainText('none');
    await expect(this.requiresHoldDisplay).toContainText('false');
  }

  async verifyApprovalWithTravelContext(expectedMapping) {
    await expect(this.mappedActionDisplay).toContainText('approve');
    await expect(this.geographicBlockDisplay).toContainText('false');
    await expect(this.travelContextAppliedDisplay).toContainText('true');
  }

  async verifyAlertCreatedAndStepUpInitiated(alertExecution) {
    await expect(this.alertIdDisplay).toContainText(alertExecution.alert_id);
    await expect(this.alertStatusDisplay).toContainText(alertExecution.status);
    await expect(this.authenticationLevelDisplay).toContainText(alertExecution.authentication_level);
  }

  async verifyTransactionDeclinedAndUrgentAlertCreated(executionResult) {
    await expect(this.transactionStatusDisplay).toContainText('declined');
    await expect(this.alertIdDisplay).toContainText(executionResult.alert_id);
    await expect(this.alertSeverityDisplay).toContainText('urgent');
    await expect(this.alertStatusDisplay).toContainText(executionResult.status);
  }

  async verifyTransactionApprovedWithoutFriction(executionResult) {
    await expect(this.transactionStatusDisplay).toContainText('approved');
    await expect(this.alertCreatedDisplay).toContainText('false');
    await expect(this.additionalAuthDisplay).toContainText('false');
  }

  async verifyInternationalTransactionApprovedWithoutFriction(executionResult) {
    await expect(this.transactionStatusDisplay).toContainText('approved');
    await expect(this.geographicFrictionDisplay).toContainText('false');
    await expect(this.alertCreatedDisplay).toContainText('false');
  }

  async verifyActionExecutionRecordedInAudit(auditRecord) {
    await expect(this.auditIdDisplay).toContainText(auditRecord.audit_id);
    await expect(this.page.locator('[data-testid="audit-decision-id"]')).toContainText(auditRecord.decision_id);
    await expect(this.page.locator('[data-testid="audit-policy-id"]')).toContainText(auditRecord.policy_id);
    await expect(this.page.locator('[data-testid="audit-action-executed"]')).toContainText(auditRecord.action_executed);
  }

  async verifyHighRiskActionRecordedInAudit(auditRecord) {
    await expect(this.auditIdDisplay).toContainText(auditRecord.audit_id);
    await expect(this.page.locator('[data-testid="audit-decision-id"]')).toContainText(auditRecord.decision_id);
    await expect(this.page.locator('[data-testid="audit-action-executed"]')).toContainText('decline_and_alert');
  }

  async verifyLowRiskApprovalRecordedInAudit(auditRecord) {
    await expect(this.auditIdDisplay).toContainText(auditRecord.audit_id);
    await expect(this.page.locator('[data-testid="audit-action-executed"]')).toContainText('approve');
    await expect(this.page.locator('[data-testid="audit-intervention"]')).toContainText('none');
  }

  async verifyApprovalWithTravelContextRecordedInAudit(auditRecord) {
    await expect(this.auditIdDisplay).toContainText(auditRecord.audit_id);
    await expect(this.customerContextDisplay).toContainText(auditRecord.customer_context);
    await expect(this.page.locator('[data-testid="audit-action-executed"]')).toContainText('approve');
  }

  async configureMissingPolicy(missingPolicyConfig) {
    await this.policyIdInput.fill(missingPolicyConfig.policy_id);
    await this.riskBandInput.fill(missingPolicyConfig.risk_band);
    await this.policyStatusInput.fill(missingPolicyConfig.status);
    await this.actionInput.clear();
  }

  async verifyPolicyConfigurationMissing(missingPolicyConfig) {
    await expect(this.policyStatusInput).toHaveValue('missing');
    await expect(this.actionInput).toBeEmpty();
  }

  async configureInvalidPolicyAction(invalidPolicyConfig) {
    await this.policyIdInput.fill(invalidPolicyConfig.policy_id);
    await this.riskBandInput.fill(invalidPolicyConfig.risk_band);
    await this.thresholdMinInput.fill(invalidPolicyConfig.threshold_min.toString());
    await this.thresholdMaxInput.fill(invalidPolicyConfig.threshold_max.toString());
    await this.actionInput.fill(invalidPolicyConfig.action);
  }

  async verifyInvalidActionConfiguration(invalidPolicyConfig) {
    await expect(this.actionInput).toHaveValue(invalidPolicyConfig.action);
  }

  async verifyMissingPolicyDetected(decisionId, riskBand) {
    await expect(this.errorLogDisplay).toContainText(`Missing policy configuration for risk_band: ${riskBand}, decision_id: ${decisionId}`);
  }

  async verifyInvalidActionDetected(decisionId, invalidAction) {
    await expect(this.errorLogDisplay).toContainText(`Invalid policy action: ${invalidAction}`);
    await expect(this.errorLogDisplay).toContainText(`decision_id: ${decisionId}`);
  }

  async verifyFailSafePolicyApplied(failSafePolicy) {
    await expect(this.failSafeActionDisplay).toContainText(failSafePolicy.fail_safe_action);
    await expect(this.failSafePolicyDisplay).toContainText(failSafePolicy.fail_safe_policy);
    await expect(this.transactionStatusDisplay).toContainText(failSafePolicy.transaction_status);
  }

  async verifyErrorRecordCreated(errorRecord) {
    await expect(this.errorIdDisplay).toContainText(errorRecord.error_id);
    await expect(this.page.locator('[data-testid="error-decision-id"]')).toContainText(errorRecord.decision_id);
    await expect(this.errorTypeDisplay).toContainText(errorRecord.error_type);
    await expect(this.failSafeAppliedDisplay).toContainText('true');
  }

  async verifyConfigurationErrorRecordCreated(errorRecord) {
    await expect(this.errorIdDisplay).toContainText(errorRecord.error_id);
    await expect(this.errorTypeDisplay).toContainText(errorRecord.error_type);
    await expect(this.invalidActionDisplay).toContainText(errorRecord.invalid_action);
    await expect(this.failSafeAppliedDisplay).toContainText('true');
  }

  async verifyTransactionNotIncorrectlyApproved(transactionVerification) {
    await expect(this.transactionStatusDisplay).toContainText('declined');
    await expect(this.incorrectApprovalDisplay).toContainText('false');
  }

  async verifyTransactionDeclinedNotApproved(transactionVerification) {
    await expect(this.transactionStatusDisplay).toContainText('declined');
    await expect(this.incorrectApprovalDisplay).toContainText('false');
  }

  async verifyFailSafeRecordedInAudit(auditRecord) {
    await expect(this.auditIdDisplay).toContainText(auditRecord.audit_id);
    await expect(this.policyErrorDisplay).toContainText('true');
    await expect(this.failSafeAppliedDisplay).toContainText('true');
    await expect(this.page.locator('[data-testid="audit-action-executed"]')).toContainText('decline');
  }

  async verifyInvalidConfigRecordedInAudit(auditRecord) {
    await expect(this.auditIdDisplay).toContainText(auditRecord.audit_id);
    await expect(this.configErrorDisplay).toContainText('true');
    await expect(this.failSafeAppliedDisplay).toContainText('true');
    await expect(this.page.locator('[data-testid="audit-action-executed"]')).toContainText('decline');
  }
};