(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('AlertService', ['$http', 'AuditService', function($http, AuditService) {
      var apiUrl = '/api/alerts';
      this.createAlert = function(fraudAlert) {
        fraudAlert.alertId = generateId();
        fraudAlert.createdAt = new Date();
        fraudAlert.status = 'PENDING';
        return $http.post(apiUrl, fraudAlert).then(function(response) {
          AuditService.logEvent('ALERT_CREATED', fraudAlert);
          return response.data;
        }).catch(function(error) {
          console.error('Alert creation failed:', error);
          throw error;
        });
      };
      this.getAlerts = function() {
        return $http.get(apiUrl).then(function(response) {
          return response.data;
        });
      };
      this.updateAlertStatus = function(alertId, status) {
        return $http.patch(apiUrl + '/' + alertId, { status: status }).then(function(response) {
          return response.data;
        });
      };
      function generateId() {
        return 'ALT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      }
    }]);
})();