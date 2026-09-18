(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .service('auditService', ['$http', 'API_ENDPOINTS', function($http, API_ENDPOINTS) {
      const self = this;
      
      self.logDecision = function(auditData) {
        const payload = {
          logId: self.generateId(),
          transactionId: auditData.transactionId,
          eventType: auditData.eventType,
          payload: auditData.payload,
          timestamp: new Date(),
          userId: auditData.userId || 'system'
        };
        return $http.post(API_ENDPOINTS.auditLogs, payload)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Audit log failed:', error);
            return null;
          });
      };
      
      self.logError = function(error) {
        const payload = {
          logId: self.generateId(),
          eventType: 'error',
          payload: {
            status: error.status,
            statusText: error.statusText,
            url: error.config ? error.config.url : 'unknown'
          },
          timestamp: new Date(),
          userId: 'system'
        };
        return $http.post(API_ENDPOINTS.auditLogs, payload).catch(function() {});
      };
      
      self.getAuditLogs = function(transactionId) {
        return $http.get(API_ENDPOINTS.auditLogs, {
          params: { transactionId: transactionId }
        }).then(function(response) {
          return response.data;
        });
      };
      
      self.generateId = function() {
        return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      };
    }]);
})();