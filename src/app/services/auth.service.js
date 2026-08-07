(function() {
  'use strict';
  angular.module('onlineShoppingApp')
    .service('authService', ['$http', '$window', '$q', 'apiConfig', function($http, $window, $q, apiConfig) {
      var self = this;
      self.login = function(credentials) {
        var deferred = $q.defer();
        $http.post(apiConfig.baseUrl + '/auth/login', credentials, {timeout: apiConfig.timeout})
          .then(function(response) {
            if (response.data && response.data.authToken) {
              $window.localStorage.setItem('authToken', response.data.authToken);
              $window.localStorage.setItem('user', JSON.stringify(response.data));
              deferred.resolve(response.data);
            } else {
              deferred.reject('Invalid response');
            }
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.register = function(userData) {
        var deferred = $q.defer();
        $http.post(apiConfig.baseUrl + '/auth/register', userData, {timeout: apiConfig.timeout})
          .then(function(response) {
            deferred.resolve(response.data);
          }, function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      self.logout = function() {
        $window.localStorage.removeItem('authToken');
        $window.localStorage.removeItem('user');
      };
      self.getToken = function() {
        return $window.localStorage.getItem('authToken');
      };
      self.isAuthenticated = function() {
        return !!self.getToken();
      };
      self.getCurrentUser = function() {
        var user = $window.localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      };
    }]);
})();