(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('systemHealthService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.getMetrics = function() {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/admin/health', {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getPlatformAnalytics = function() {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/admin/analytics', {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();