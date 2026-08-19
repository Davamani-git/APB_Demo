(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .service('FraudRiskService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      var self = this;

      self.evaluateRisk = function(transactionEvent) {
        if (!transactionEvent || !transactionEvent.transactionId) {
          return $q.reject('Invalid transaction event');
        }

        var payload = {
          transactionId: transactionEvent.transactionId,
          cardNumber: transactionEvent.cardNumber,
          amount: transactionEvent.amount,
          currency: transactionEvent.currency,
          merchantId: transactionEvent.merchantId,
          merchantName: transactionEvent.merchantName,
          merchantCategory: transactionEvent.merchantCategory,
          transactionTimestamp: transactionEvent.transactionTimestamp,
          location: transactionEvent.location,
          authorizationStatus: transactionEvent.authorizationStatus,
          cardCompromisedFlag: transactionEvent.cardCompromisedFlag
        };

        return $http.post(API_ENDPOINTS.FRAUD_RISK_EVALUATE, payload)
          .then(function(response) {
            return self.normalizeRiskAssessment(response.data);
          })
          .catch(function(error) {
            console.error('Error evaluating risk:', error);
            return $q.reject(error);
          });
      };

      self.normalizeRiskAssessment = function(data) {
        return {
          transactionId: data.transactionId,
          riskScore: parseFloat(data.riskScore) || 0,
          riskLevel: data.riskLevel || 'low',
          signals: {
            unusualAmount: data.signals?.unusualAmount || false,
            suspiciousMerchant: data.signals?.suspiciousMerchant || false,
            geographicAnomaly: data.signals?.geographicAnomaly || false,
            velocityViolation: data.signals?.velocityViolation || false,
            authorizationFailure: data.signals?.authorizationFailure || false,
            compromisedCard: data.signals?.compromisedCard || false
          },
          modelVersion: data.modelVersion || '1.0',
          evaluatedAt: new Date(data.evaluatedAt || Date.now())
        };
      };
    }]);
})();