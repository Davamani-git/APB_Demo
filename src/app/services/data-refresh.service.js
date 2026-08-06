(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('DataRefreshService', ['$interval', 'KPIAggregationService', function($interval, KPIAggregationService) {
      var refreshInterval = null;
      var refreshRate = 60000;
      this.startAutoRefresh = function(callback) {
        this.stopAutoRefresh();
        refreshInterval = $interval(function() {
          KPIAggregationService.clearCache();
          KPIAggregationService.getAggregatedKPIs().then(function(kpis) {
            if (callback) callback(kpis);
          });
        }, refreshRate);
      };
      this.stopAutoRefresh = function() {
        if (refreshInterval) {
          $interval.cancel(refreshInterval);
          refreshInterval = null;
        }
      };
      this.setRefreshRate = function(rate) {
        refreshRate = rate;
      };
    }]);
})();