(function() {
  'use strict';
  angular.module('wearableIntegrationApp')
    .factory('SyncService', ['$http', '$interval', 'DataTransformFactory', 'HealthDataService', 'API_ENDPOINT', function($http, $interval, DataTransformFactory, HealthDataService, API_ENDPOINT) {
      var syncInterval;
      var maxRetries = 3;
      function pollDeviceSDK() {
        var retries = 0;
        function attemptSync() {
          try {
            $http.get(API_ENDPOINT + '/device/metrics').then(function(response) {
              var rawData = response.data;
              var normalizedMetrics = DataTransformFactory.normalize(rawData);
              HealthDataService.saveMetrics(normalizedMetrics).then(function() {
                console.log('Metrics synced successfully');
              }).catch(function(err) {
                console.error('Failed to save metrics:', err);
                if (retries < maxRetries) {
                  retries++;
                  attemptSync();
                }
              });
            }).catch(function(err) {
              console.error('Failed to poll device SDK:', err);
              if (retries < maxRetries) {
                retries++;
                attemptSync();
              }
            });
          } catch (err) {
            console.error('Sync error:', err);
            if (retries < maxRetries) {
              retries++;
              attemptSync();
            }
          }
        }
        attemptSync();
      }
      return {
        startSync: function() {
          if (!syncInterval) {
            syncInterval = $interval(pollDeviceSDK, 60000);
          }
        },
        stopSync: function() {
          if (syncInterval) {
            $interval.cancel(syncInterval);
            syncInterval = null;
          }
        }
      };
    }]);
})();