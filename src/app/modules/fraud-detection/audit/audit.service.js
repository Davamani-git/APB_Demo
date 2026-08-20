(function() {
  'use strict';
  angular.module('fraudDetection.audit')
    .factory('AuditService', ['$http', function($http) {
      return {
        logEvent: function(eventType, alertId, payload) {
          var auditRecord = {
            auditId: 'AUD-' + Date.now(),
            eventType: eventType,
            alertId: alertId,
            transactionId: payload.transactionId || null,
            modelVersion: payload.modelVersion || '1.0',
            payload: payload,
            timestamp: new Date()
          };
          return $http.post('/api/audit/events', auditRecord)
            .then(function(response) {
              return response.data;
            });
        },
        getAuditTrail: function(alertId) {
          return $http.get('/api/audit/events', { params: { alertId: alertId } })
            .then(function(response) {
              return response.data;
            });
        }
      };
    }]);
})();