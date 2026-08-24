angular.module('fraudDetection').service('FraudRiskEngineService', ['$http', '$q', function($http, $q) {
  var API_BASE = '/api';
  var FRAUD_ENGINE_ENDPOINT = API_BASE + '/fraud-risk/evaluate';
  
  this.evaluateTransaction = function(transactionEvent) {
    if (!transactionEvent || !transactionEvent.transactionId) {
      return $q.reject({error: 'Invalid transaction for risk evaluation'});
    }
    var payload = {
      transactionId: transactionEvent.transactionId,
      cardNumber: transactionEvent.cardNumber,
      amount: transactionEvent.amount,
      currency: transactionEvent.currency,
      merchantId: transactionEvent.merchantId,
      merchantName: transactionEvent.merchantName,
      merchantCategory: transactionEvent.merchantCategory,
      location: transactionEvent.location,
      deviceId: transactionEvent.deviceId,
      deviceFingerprint: transactionEvent.deviceFingerprint,
      timestamp: transactionEvent.timestamp
    };
    return $http.post(FRAUD_ENGINE_ENDPOINT, payload).then(function(response) {
      var riskScore = {
        transactionId: transactionEvent.transactionId,
        overallScore: response.data.overallScore || 0,
        riskLevel: response.data.riskLevel || 'low',
        signals: response.data.signals || {
          amountAnomaly: 0,
          geographicRisk: 0,
          merchantRisk: 0,
          velocityRisk: 0,
          deviceRisk: 0
        },
        evaluatedAt: new Date()
      };
      return riskScore;
    }).catch(function(error) {
      return $q.reject({error: 'Fraud risk engine unavailable', details: error});
    });
  };
  
  this.getRiskThresholds = function() {
    return $http.get(API_BASE + '/fraud-risk/thresholds').then(function(response) {
      return response.data;
    }).catch(function(error) {
      return {low: 30, medium: 60, high: 85};
    });
  };
}]);