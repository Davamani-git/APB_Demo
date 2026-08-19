(function() {
  'use strict';
  angular.module('fraudAlertApp')
    .service('ConfigService', ['$http', '$q', 'API_ENDPOINTS', function($http, $q, API_ENDPOINTS) {
      var self = this;

      self.getThresholds = function() {
        return $http.get(API_ENDPOINTS.CONFIG_THRESHOLDS)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error fetching thresholds:', error);
            return self.getDefaultThresholds();
          });
      };

      self.updateThresholds = function(thresholds) {
        if (!self.validateThresholds(thresholds)) {
          return $q.reject('Invalid threshold values');
        }

        var payload = {
          thresholdId: thresholds.thresholdId || 'default',
          low: parseFloat(thresholds.low),
          medium: parseFloat(thresholds.medium),
          high: parseFloat(thresholds.high),
          confirmedFraud: parseFloat(thresholds.confirmedFraud),
          updatedBy: localStorage.getItem('userId') || 'system',
          updatedAt: new Date().toISOString()
        };

        return $http.put(API_ENDPOINTS.CONFIG_THRESHOLDS, payload)
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            console.error('Error updating thresholds:', error);
            return $q.reject(error);
          });
      };

      self.validateThresholds = function(thresholds) {
        return thresholds &&
               thresholds.low >= 0 &&
               thresholds.medium > thresholds.low &&
               thresholds.high > thresholds.medium &&
               thresholds.confirmedFraud > thresholds.high &&
               thresholds.confirmedFraud <= 100;
      };

      self.getDefaultThresholds = function() {
        return $q.resolve({
          thresholdId: 'default',
          low: 20,
          medium: 40,
          high: 70,
          confirmedFraud: 90,
          updatedBy: 'system',
          updatedAt: new Date().toISOString()
        });
      };
    }]);
})();