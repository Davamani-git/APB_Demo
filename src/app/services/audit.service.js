angular.module('fraudDetectionApp').service('AuditService', ['$http', '$q', function($http, $q) {
  var API_BASE = '/api/audit';

  this.logEvent = function(eventType, eventData) {
    var auditRecord = {
      eventType: eventType,
      eventData: eventData,
      timestamp: new Date(),
      userId: 'SYSTEM'
    };
    return $http.post(API_BASE + '/log', auditRecord).then(function(response) {
      return response.data;
    });
  };

  this.logTransactionEvent = function(transaction) {
    return this.logEvent('TRANSACTION_INGESTED', transaction);
  };

  this.logRiskScore = function(riskScoreData) {
    return this.logEvent('RISK_SCORE_CALCULATED', riskScoreData);
  };

  this.logPolicyDecision = function(policyDecision) {
    return this.logEvent('POLICY_DECISION_MADE', policyDecision);
  };

  this.logAlertCreated = function(alert) {
    return this.logEvent('ALERT_CREATED', alert);
  };

  this.logCustomerResponse = function(alertId, response) {
    return this.logEvent('CUSTOMER_RESPONSE', { alertId: alertId, response: response });
  };

  this.getAuditLogs = function(filters) {
    return $http.get(API_BASE + '/logs', { params: filters }).then(function(response) {
      return response.data;
    });
  };

  this.getAnalytics = function(dateRange) {
    return $http.get(API_BASE + '/analytics', { params: dateRange }).then(function(response) {
      return response.data;
    });
  };
}]);