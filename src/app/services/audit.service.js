angular.module('fraudAlertApp')
  .service('AuditService', ['$http', 'API_CONFIG', function($http, API_CONFIG) {
    this.logDecision = function(transaction, decision) {
      var auditRecord = {
        transactionId: transaction.transactionId,
        decision: decision.decision,
        riskScore: decision.riskScore,
        riskBand: decision.riskBand,
        timestamp: new Date().toISOString(),
        eventType: 'fraud_decision'
      };
      return $http.post(API_CONFIG.auditUrl, auditRecord)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Audit logging failed:', error);
          return null;
        });
    };
    this.logEvent = function(eventType, eventData) {
      var auditRecord = {
        eventType: eventType,
        eventData: eventData,
        timestamp: new Date().toISOString()
      };
      return $http.post(API_CONFIG.auditUrl, auditRecord)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          console.error('Audit event logging failed:', error);
          return null;
        });
    };
  }]);