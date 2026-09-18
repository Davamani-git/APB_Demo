(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .service('AuthService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      let authToken = null;
      
      this.getToken = function() {
        if (authToken) {
          return $q.resolve(authToken);
        }
        return $http.get(API_CONFIG.authUrl + '/token')
          .then(function(response) {
            authToken = response.data.token;
            return authToken;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      };
      
      this.setToken = function(token) {
        authToken = token;
      };
      
      this.clearToken = function() {
        authToken = null;
      };
    }]);
})();