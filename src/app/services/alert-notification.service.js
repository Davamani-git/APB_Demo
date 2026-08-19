(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .service('AlertNotificationService', ['$http', '$q', 'AuditTrailService', 'API_ENDPOINTS', function($http, $q, AuditTrailService, API_ENDPOINTS) {
      var self = this;

      self.sendAlert = function(transactionId, riskLevel, riskAssessment) {
        if (!transactionId) {
          return $q.reject('Transaction ID is required');
        }

        var payload = {
          transactionId: transactionId,
          riskLevel: riskLevel,
          timestamp: new Date().toISOString(),
          signals: riskAssessment?.signals || {}
        };

        return $http.post(API_ENDPOINTS.ALERTS_FRAUD, payload)
          .then(function(response) {
            AuditTrailService.logEvent({
              eventType: 'ALERT_SENT',
              transactionId: transactionId,
              riskLevel: riskLevel,
              timestamp: new Date()
            });
            return response.data;
          })
          .catch(function(error) {
            console.error('Error sending alert:', error);
            return $q.reject(error);
          });
      };
    }]);
})();