angular.module('fraudAlert.ingestion')
  .service('PolicyDecisionService', ['$q', 'RiskThresholdFactory', 'AlertService', 'AuditService', function($q, RiskThresholdFactory, AlertService, AuditService) {
    this.determineAction = function(transaction, riskEvaluation) {
      return RiskThresholdFactory.getThresholds()
        .then(function(thresholds) {
          var riskScore = riskEvaluation.riskScore;
          var decision = {
            transactionId: transaction.transactionId,
            riskScore: riskScore,
            riskBand: '',
            decision: '',
            timestamp: new Date().toISOString()
          };
          if (riskScore >= thresholds.high) {
            decision.riskBand = 'high';
            decision.decision = 'hold';
            return AlertService.createAlert(transaction, decision)
              .then(function(alert) {
                decision.alertId = alert.alertId;
                return decision;
              });
          } else if (riskScore >= thresholds.medium) {
            decision.riskBand = 'medium';
            decision.decision = 'alert';
            return AlertService.createAlert(transaction, decision)
              .then(function(alert) {
                decision.alertId = alert.alertId;
                return decision;
              });
          } else {
            decision.riskBand = 'low';
            decision.decision = 'approve';
            return $q.resolve(decision);
          }
        })
        .catch(function(error) {
          console.error('Policy decision failed:', error);
          var failSafeDecision = {
            transactionId: transaction.transactionId,
            riskScore: riskEvaluation.riskScore,
            riskBand: 'unknown',
            decision: 'hold',
            timestamp: new Date().toISOString(),
            error: 'fail-safe'
          };
          AuditService.logEvent('policy_fail_safe', { transactionId: transaction.transactionId, error: error.message });
          return $q.resolve(failSafeDecision);
        });
    };
  }]);