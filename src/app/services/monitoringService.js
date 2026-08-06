(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .service('monitoringService', ['$interval', '$http', function($interval, $http) {
      var monitoringInterval = null;
      var checkIntervalMs = 300000;
      this.startMonitoring = function() {
        if (monitoringInterval) {
          return;
        }
        monitoringInterval = $interval(function() {
          $http.get('/api/monitoring/check').then(function(response) {
            if (response.data && response.data.alertConditions) {
              response.data.alertConditions.forEach(function(condition) {
                if (condition.breached) {
                  $http.post('/api/alerts', condition);
                }
              });
            }
          });
        }, checkIntervalMs);
      };
      this.stopMonitoring = function() {
        if (monitoringInterval) {
          $interval.cancel(monitoringInterval);
          monitoringInterval = null;
        }
      };
      this.checkBudgetThreshold = function(companyId, threshold) {
        return $http.post('/api/monitoring/budget', {
          companyId: companyId,
          threshold: threshold
        }).then(function(response) {
          return response.data;
        });
      };
    }]);
})();