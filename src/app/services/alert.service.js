(function() {
  'use strict';
  angular.module('energyMonitoringApp').service('AlertService', ['$http', '$interval', '$q', AlertService]);
  function AlertService($http, $interval, $q) {
    const API_BASE = 'https://api.smarthome.example.com';
    let alertInterval = null;
    this.checkAlerts = function() {
      return $http.get(API_BASE + '/api/alerts/active').then(function(response) {
        return response.data.map(function(alert) {
          return {
            alertId: alert.alertId,
            type: alert.type,
            message: alert.message,
            timestamp: new Date(alert.timestamp),
            severity: alert.severity
          };
        });
      }).catch(function(error) {
        console.error('Failed to fetch alerts:', error);
        return [];
      });
    };
    this.startAlertPolling = function(callback, interval) {
      const pollInterval = interval || 30000;
      if (alertInterval) {
        $interval.cancel(alertInterval);
      }
      alertInterval = $interval(function() {
        this.checkAlerts().then(callback);
      }.bind(this), pollInterval);
      return alertInterval;
    };
    this.stopAlertPolling = function() {
      if (alertInterval) {
        $interval.cancel(alertInterval);
        alertInterval = null;
      }
    };
  }
})();