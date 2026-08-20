(function() {
  'use strict';
  angular.module('fraudDetection.riskEngine')
    .factory('RiskScoringService', ['$http', '$q', '$log', 'RiskSignalsFactory', function($http, $q, $log, RiskSignalsFactory) {
      return {
        calculateRiskScore: function(transaction) {
          return $http.post('/api/risk/score', { transactionId: transaction.transactionId })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              $log.error('Risk scoring failed', error);
              return $q.reject(error);
            });
        },
        evaluateTransaction: function(transaction, context) {
          var signals = {
            amountAnomaly: RiskSignalsFactory.evaluateAmountAnomaly(transaction, context.customerHistory),
            merchantRisk: RiskSignalsFactory.evaluateMerchantRisk(transaction, context.merchantData),
            geoInconsistency: RiskSignalsFactory.evaluateGeoInconsistency(transaction, context.customerProfile),
            velocityAlert: RiskSignalsFactory.evaluateVelocityAlert(context.recentTransactions),
            deviceRisk: RiskSignalsFactory.evaluateDeviceRisk(transaction.deviceId, context.deviceData)
          };
          var score = 0;
          if (signals.amountAnomaly) score += 25;
          if (signals.merchantRisk === 'high') score += 30;
          else if (signals.merchantRisk === 'medium') score += 15;
          if (signals.geoInconsistency) score += 20;
          if (signals.velocityAlert) score += 15;
          if (signals.deviceRisk === 'high') score += 25;
          else if (signals.deviceRisk === 'medium') score += 10;
          var riskBand = 'low';
          if (score >= 75) riskBand = 'confirmed_fraud';
          else if (score >= 50) riskBand = 'high';
          else if (score >= 25) riskBand = 'medium';
          return {
            decisionId: 'DEC-' + Date.now(),
            transactionId: transaction.transactionId,
            riskScore: score,
            riskBand: riskBand,
            modelVersion: '1.0',
            signals: signals,
            timestamp: new Date()
          };
        }
      };
    }]);
})();