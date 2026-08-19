angular.module('fraudDetectionApp').factory('fraudRiskEngineFactory', ['$http', '$q', function($http, $q) {
  const API_BASE = '/api/fraud-risk-engine';
  
  return {
    calculateRiskScore: function(transaction) {
      const requestPayload = {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        merchantId: transaction.merchantId,
        merchantName: transaction.merchantName,
        location: transaction.location,
        deviceFingerprint: transaction.deviceFingerprint,
        timestamp: transaction.timestamp
      };
      
      return $http.post(API_BASE + '/evaluate', requestPayload)
        .then(response => {
          return {
            riskScore: response.data.riskScore || 0,
            riskSignals: response.data.riskSignals || {
              amountAnomaly: false,
              geographicInconsistency: false,
              merchantReputation: 'unknown',
              velocityPattern: 'normal',
              deviceRisk: 'low'
            },
            modelVersion: response.data.modelVersion || 'unknown'
          };
        })
        .catch(error => {
          return $q.reject({
            message: 'Fraud risk engine unavailable',
            error: error,
            transactionId: transaction.transactionId
          });
        });
    },
    
    getModelVersion: function() {
      return $http.get(API_BASE + '/version')
        .then(response => response.data.version)
        .catch(error => $q.reject(error));
    }
  };
}]);