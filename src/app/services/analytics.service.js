(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('analyticsService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.getSalesMetrics = function(sellerId, period) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/analytics/sales', {params: {sellerId: sellerId, period: period}, timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getPerformanceData = function(sellerId) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/analytics/performance', {params: {sellerId: sellerId}, timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();