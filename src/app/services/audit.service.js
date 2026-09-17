(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('AuditService', ['$http', function($http) {
      var apiUrl = '/api/audit';
      this.logEvent = function(eventType, payload) {
        var auditRecord = {
          recordId: generateId(),
          transactionId: payload.transactionId || null,
          eventType: eventType,
          payload: payload,
          timestamp: new Date()
        };
        return $http.post(apiUrl, auditRecord).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Audit logging failed:', error);
          return null;
        });
      };
      function generateId() {
        return 'AUD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      }
    }]);
})();