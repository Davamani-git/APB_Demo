(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('userService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
      var self = this;
      self.getUsers = function(params) {
        var deferred = $q.defer();
        $http.get(apiConfig.baseUrl + '/users', {params: params, timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.lockAccount = function(userId) {
        var deferred = $q.defer();
        $http.put(apiConfig.baseUrl + '/users/' + userId + '/lock', {}, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.unlockAccount = function(userId) {
        var deferred = $q.defer();
        $http.put(apiConfig.baseUrl + '/users/' + userId + '/unlock', {}, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();