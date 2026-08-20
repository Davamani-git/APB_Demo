(function() {
  'use strict';
  angular.module('fraudDetection.policy')
    .factory('PolicyDecisionService', ['$http', 'ThresholdConfigService', function($http, ThresholdConfigService) {
      return {
        makeDecision: function(riskDecision) {
          return ThresholdConfigService.getThresholds()
            .then(function(thresholds) {
              var decision = 'approve';
              if (riskDecision.riskBand === 'confirmed_fraud') {
                decision = 'decline';
              } else if (riskDecision.riskBand === 'high') {
                decision = 'hold';
              } else if (riskDecision.riskBand === 'medium') {
                decision = 'alert';
              } else if (riskDecision.riskScore >= (thresholds.stepUpThreshold || 40)) {
                decision = 'step_up';
              }
              return {
                decisionId: riskDecision.decisionId,
                transactionId: riskDecision.transactionId,
                riskScore: riskDecision.riskScore,
                riskBand: riskDecision.riskBand,
                decision: decision,
                signals: riskDecision.signals,
                modelVersion: riskDecision.modelVersion,
                timestamp: new Date()
              };
            });
        },
        submitDecision: function(decision) {
          return $http.post('/api/policy/decisions', decision)
            .then(function(response) {
              return response.data;
            });
        }
      };
    }]);
})();