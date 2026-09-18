(function() {
  'use strict';
  angular.module('dashboardModule').service('authService', ['$http', '$window', function($http, $window) {
    var self = this;
    var TOKEN_KEY = 'sso_token';
    self.authenticate = function(credentials) {
      return $http.post('/api/auth/login', credentials).then(function(response) {
        if (response.data && response.data.token) {
          $window.sessionStorage.setItem(TOKEN_KEY, response.data.token);
          return response.data;
        }
        throw new Error('Authentication failed');
      }).catch(function(error) {
        throw error;
      });
    };
    self.getToken = function() {
      return $window.sessionStorage.getItem(TOKEN_KEY);
    };
    self.isAuthenticated = function() {
      return !!self.getToken();
    };
    self.logout = function() {
      $window.sessionStorage.removeItem(TOKEN_KEY);
    };
    self.validateSession = function() {
      return $http.get('/api/auth/validate').then(function(response) {
        return response.data.valid;
      }).catch(function() {
        self.logout();
        return false;
      });
    };
  }]);
})();