(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('freshnessMonitorService', ['$interval', '$rootScope', 'notificationService', function($interval, $rootScope, notificationService) {
      var self = this;
      var monitoringInterval = null;
      var CHECK_INTERVAL = 300000;
      var dataStore = {};
      self.startMonitoring = function() {
        if (monitoringInterval) return;
        monitoringInterval = $interval(function() {
          self.checkDataFreshness();
        }, CHECK_INTERVAL);
      };
      self.stopMonitoring = function() {
        if (monitoringInterval) {
          $interval.cancel(monitoringInterval);
          monitoringInterval = null;
        }
      };
      self.checkDataFreshness = function() {
        var now = new Date();
        var threshold = 24 * 60 * 60 * 1000;
        Object.keys(dataStore).forEach(function(companyId) {
          var data = dataStore[companyId];
          if (data.lastUpdated && (now - new Date(data.lastUpdated)) > threshold) {
            self.notifyStaleData(companyId, data);
          }
        });
      };
      self.notifyStaleData = function(companyId, data) {
        var message = 'Data for company ' + (data.companyName || companyId) + ' is outdated (last updated: ' + new Date(data.lastUpdated).toLocaleString() + ')';
        notificationService.warning(message, 'Stale Data');
        $rootScope.$broadcast('data:stale', {companyId: companyId, data: data});
      };
      self.registerData = function(companyId, data) {
        dataStore[companyId] = {
          companyName: data.companyName,
          lastUpdated: data.lastUpdated || new Date(),
          status: data.status
        };
      };
      self.getDataStatus = function(companyId) {
        return dataStore[companyId] || null;
      };
      self.isDataFresh = function(companyId) {
        var data = dataStore[companyId];
        if (!data || !data.lastUpdated) return false;
        var now = new Date();
        var threshold = 24 * 60 * 60 * 1000;
        return (now - new Date(data.lastUpdated)) <= threshold;
      };
    }]);
})();