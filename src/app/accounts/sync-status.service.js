(function() {
  'use strict';
  angular.module('app.accounts')
    .service('SyncStatusService', ['$http', '$interval', '$rootScope', 'API_CONFIG', function($http, $interval, $rootScope, API_CONFIG) {
      var pollInterval = null;
      this.startPolling = function(accountId) {
        this.stopPolling();
        pollInterval = $interval(function() {
          $http.get(API_CONFIG.baseUrl + '/accounts/' + accountId + '/sync-status')
            .then(function(response) {
              $rootScope.$broadcast('syncStatusUpdate', response.data);
            });
        }, 5000);
      };
      this.stopPolling = function() {
        if (pollInterval) {
          $interval.cancel(pollInterval);
          pollInterval = null;
        }
      };
      this.getSyncStatus = function(accountId) {
        return $http.get(API_CONFIG.baseUrl + '/accounts/' + accountId + '/sync-status')
          .then(function(response) {
            return response.data;
          });
      };
    }]);
})();