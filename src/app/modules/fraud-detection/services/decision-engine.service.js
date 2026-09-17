(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('DecisionEngineService', ['AlertService', 'AuditService', function(AlertService, AuditService) {
      var thresholds = {
        LOW: { min: 0, max: 30 },
        MEDIUM: { min: 30, max: 70 },
        HIGH: { min: 70, max: 90 },
        CONFIRMED_FRAUD: { min: 90, max: 100 }
      };
      this.applyDecisionRules = function(fraudRiskResult) {
        var decision = fraudRiskResult.decision;
        var riskScore = fraudRiskResult.riskScore;
        var riskLevel = determineRiskLevel(riskScore);
        fraudRiskResult.riskLevel = riskLevel;
        if (decision === 'ALERT' || decision === 'HOLD' || decision === 'DECLINE') {
          var fraudAlert = {
            transactionId: fraudRiskResult.transactionId,
            cardId: fraudRiskResult.cardId || 'UNKNOWN',
            riskScore: riskScore,
            riskLevel: riskLevel,
            decision: decision
          };
          AlertService.createAlert(fraudAlert);
        }
        AuditService.logEvent('DECISION', fraudRiskResult);
        return fraudRiskResult;
      };
      this.setThresholds = function(newThresholds) {
        angular.extend(thresholds, newThresholds);
      };
      function determineRiskLevel(score) {
        if (score >= thresholds.CONFIRMED_FRAUD.min) return 'CONFIRMED_FRAUD';
        if (score >= thresholds.HIGH.min) return 'HIGH';
        if (score >= thresholds.MEDIUM.min) return 'MEDIUM';
        return 'LOW';
      }
    }]);
})();