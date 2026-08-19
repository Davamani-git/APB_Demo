angular.module('fraudDetectionApp').service('alertService', ['$http', '$q', function($http, $q) {
  const API_BASE = '/api/alerts';
  
  this.triggerAlert = function(transaction, riskDecision) {
    const alertPayload = {
      transactionId: transaction.transactionId,
      customerId: transaction.customerId || 'unknown',
      riskLevel: riskDecision.riskLevel,
      riskScore: riskDecision.riskScore,
      amount: transaction.amount,
      currency: transaction.currency,
      merchantName: transaction.merchantName,
      timestamp: new Date().toISOString(),
      decisionReason: riskDecision.decisionReason
    };
    
    return $http.post(API_BASE, alertPayload)
      .then(response => {
        return {
          alertId: response.data.alertId,
          status: 'triggered',
          timestamp: new Date()
        };
      })
      .catch(error => {
        return $q.reject({
          message: 'Alert trigger failed',
          error: error,
          transactionId: transaction.transactionId
        });
      });
  };
  
  this.getAlertStatus = function(alertId) {
    return $http.get(API_BASE + '/' + alertId)
      .then(response => response.data)
      .catch(error => $q.reject(error));
  };
  
  this.updateAlertStatus = function(alertId, status) {
    return $http.put(API_BASE + '/' + alertId, { status: status })
      .then(response => response.data)
      .catch(error => $q.reject(error));
  };
}]);