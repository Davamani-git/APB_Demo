(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('alertService', ['$http', '$interval', '$rootScope', 'notificationService', function($http, $interval, $rootScope, notificationService) {
      var self = this;
      var monitoringInterval = null;
      var CHECK_INTERVAL = 300000;
      self.startMonitoring = function() {
        if (monitoringInterval) return;
        monitoringInterval = $interval(function() {
          self.checkBudgetThresholds();
        }, CHECK_INTERVAL);
        self.checkBudgetThresholds();
      };
      self.stopMonitoring = function() {
        if (monitoringInterval) {
          $interval.cancel(monitoringInterval);
          monitoringInterval = null;
        }
      };
      self.checkBudgetThresholds = function() {
        return $http.get('/api/alerts/budget-check')
          .then(function(response) {
            if (response.data && response.data.alerts) {
              response.data.alerts.forEach(function(alert) {
                if (alert.status === 'triggered') {
                  self.sendAlert(alert);
                  notificationService.warning('Budget threshold exceeded for ' + alert.companyName);
                }
              });
            }
          })
          .catch(function(error) {
            console.error('Budget check failed', error);
          });
      };
      self.sendAlert = function(alert) {
        return $http.post('/api/alerts/send', alert)
          .then(function(response) {
            $rootScope.$broadcast('alert:sent', alert);
            return response.data;
          });
      };
      self.configureThreshold = function(companyId, threshold) {
        return $http.post('/api/alerts/configure', {
          companyId: companyId,
          threshold: threshold
        });
      };
      self.getAlerts = function(filters) {
        return $http.get('/api/alerts', {params: filters});
      };
      self.acknowledgeAlert = function(alertId) {
        return $http.post('/api/alerts/' + alertId + '/acknowledge');
      };
    }]);
})();