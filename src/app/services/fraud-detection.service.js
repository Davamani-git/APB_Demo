(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('fraudDetectionService', ['$http', '$q', '$interval', 'apiConfig', function($http, $q, $interval, apiConfig) {
      var self = this;
      var pollInterval = null;
      self.getAlerts = function() {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/fraud/alerts', {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.startMonitoring = function(callback) {
        if (pollInterval) {
          $interval.cancel(pollInterval);
        }
        pollInterval = $interval(function() {
          self.getAlerts().then(function(alerts) {
            if (callback) callback(alerts);
          });
        }, 30000);
      };
      self.stopMonitoring = function() {
        if (pollInterval) {
          $interval.cancel(pollInterval);
          pollInterval = null;
        }
      };
      self.updateAlertStatus = function(alertId, status) {
        var deferred = $q.defer();
        $http.put(apiConfig.baseUrl + '/fraud/alerts/' + alertId, {status: status}, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();