(function() {
  'use strict';
  angular.module('fraudDetection.ingestion')
    .service('PolicyDecisionService', ['RiskThresholdFactory', 'AuditService', function(RiskThresholdFactory, AuditService) {
      this.evaluateRisk = function(riskAssessment) {
        const thresholds = RiskThresholdFactory.getActionThreshold();
        const riskScore = riskAssessment.risk_score;
        
        let action = 'approve';
        let thresholdApplied = thresholds.approve;
        
        if (riskScore >= thresholds.decline) {
          action = 'decline';
          thresholdApplied = thresholds.decline;
        } else if (riskScore >= thresholds.alert) {
          action = 'alert';
          thresholdApplied = thresholds.alert;
        } else if (riskScore >= thresholds.monitor) {
          action = 'monitor';
          thresholdApplied = thresholds.monitor;
        }
        
        const decision = {
          transaction_id: riskAssessment.transaction_id,
          action: action,
          threshold_applied: thresholdApplied,
          decided_at: new Date().toISOString()
        };
        
        AuditService.logDecision(decision);
        
        return decision;
      };
    }]);
})();