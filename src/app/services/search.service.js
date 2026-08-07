(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('searchService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.search = function(searchParams) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/products/search', {params: searchParams, timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.getCategories = function() {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/categories', {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();