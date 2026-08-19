(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .service('PolicyDecisionService', ['$q', 'RiskThresholdFactory', function($q, RiskThresholdFactory) {
      var self = this;

      self.determineAction = function(riskAssessment) {
        if (!riskAssessment || !riskAssessment.transactionId) {
          return $q.reject('Invalid risk assessment');
        }

        return RiskThresholdFactory.getThresholds()
          .then(function(thresholds) {
            var action = self.applyThresholdRules(riskAssessment, thresholds);
            return {
              transactionId: riskAssessment.transactionId,
              riskLevel: riskAssessment.riskLevel,
              action: action,
              thresholdApplied: {
                low: thresholds.low,
                medium: thresholds.medium,
                high: thresholds.high
              },
              decisionTimestamp: new Date()
            };
          })
          .catch(function(error) {
            console.error('Error determining action:', error);
            return $q.reject(error);
          });
      };

      self.applyThresholdRules = function(riskAssessment, thresholds) {
        var score = riskAssessment.riskScore;
        
        if (riskAssessment.riskLevel === 'confirmed_fraud' || score >= thresholds.confirmedFraud) {
          return 'escalate';
        }
        if (score >= thresholds.high) {
          return 'send_alert';
        }
        if (score >= thresholds.medium) {
          return 'send_alert';
        }
        if (score >= thresholds.low) {
          return 'no_alert';
        }
        return 'no_alert';
      };
    }]);
})();