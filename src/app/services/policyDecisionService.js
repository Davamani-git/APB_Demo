angular.module('fraudDetectionApp').service('policyDecisionService', ['$q', 'fraudRiskEngineFactory', 'alertService', 'auditService', 'riskDecisionModel', function($q, fraudRiskEngineFactory, alertService, auditService, riskDecisionModel) {
  const thresholds = {
    low: 30,
    medium: 60,
    high: 85
  };
  
  this.evaluateRisk = function(transaction) {
    return fraudRiskEngineFactory.calculateRiskScore(transaction)
      .then(riskData => {
        const decision = this.applyThresholds(transaction, riskData);
        
        if (decision.alertTriggered) {
          return alertService.triggerAlert(transaction, decision)
            .then(() => {
              auditService.logRiskDecision(transaction, decision);
              return decision;
            })
            .catch(error => {
              auditService.logError('Alert trigger failed', { transactionId: transaction.transactionId, error });
              decision.alertError = error;
              auditService.logRiskDecision(transaction, decision);
              return decision;
            });
        }
        
        auditService.logRiskDecision(transaction, decision);
        return decision;
      })
      .catch(error => {
        auditService.logError('Risk evaluation failed', { transactionId: transaction.transactionId, error });
        return this.getDefaultRiskDecision(transaction, error);
      });
  };
  
  this.applyThresholds = function(transaction, riskData) {
    const riskScore = riskData.riskScore || 0;
    let riskLevel = 'low';
    let alertTriggered = false;
    let decisionReason = '';
    
    if (riskScore >= thresholds.high) {
      riskLevel = 'high';
      alertTriggered = true;
      decisionReason = 'Risk score exceeds high threshold';
    } else if (riskScore >= thresholds.medium) {
      riskLevel = 'medium';
      alertTriggered = true;
      decisionReason = 'Risk score exceeds medium threshold';
    } else if (riskScore >= thresholds.low) {
      riskLevel = 'low';
      alertTriggered = false;
      decisionReason = 'Risk score within acceptable range';
    } else {
      riskLevel = 'low';
      alertTriggered = false;
      decisionReason = 'Low risk transaction';
    }
    
    return new riskDecisionModel({
      transactionId: transaction.transactionId,
      riskScore: riskScore,
      riskLevel: riskLevel,
      riskSignals: riskData.riskSignals || {},
      alertTriggered: alertTriggered,
      timestamp: new Date(),
      decisionReason: decisionReason
    });
  };
  
  this.getDefaultRiskDecision = function(transaction, error) {
    return new riskDecisionModel({
      transactionId: transaction.transactionId,
      riskScore: 0,
      riskLevel: 'low',
      riskSignals: {},
      alertTriggered: false,
      timestamp: new Date(),
      decisionReason: 'Fallback decision due to engine unavailability: ' + (error.message || 'Unknown error')
    });
  };
  
  this.updateThresholds = function(newThresholds) {
    Object.assign(thresholds, newThresholds);
    auditService.logInfo('Risk thresholds updated', thresholds);
  };
  
  this.getThresholds = function() {
    return angular.copy(thresholds);
  };
}]);