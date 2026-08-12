(function() {
  'use strict';
  angular.module('creditCardDashboard').service('DataRefreshService', ['$interval', function($interval) {
    var service = this;
    var refreshInterval = null;
    var refreshIntervalTime = 30000;

    service.startAutoRefresh = function(callback) {
      if (refreshInterval) {
        service.stopAutoRefresh();
      }
      refreshInterval = $interval(callback, refreshIntervalTime);
    };

    service.stopAutoRefresh = function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
        refreshInterval = null;
      }
    };
  }]);
})();