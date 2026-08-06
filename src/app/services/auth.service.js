(function() {
  'use strict';
  angular.module('shoppingPlatform').service('AuthService', ['$http', '$window', 'API_CONFIG', function($http, $window, API_CONFIG) {
    var self = this;
    var tokenKey = 'auth_token';
    var userKey = 'user_data';
    this.login = function(credentials) {
      return $http.post(API_CONFIG.baseUrl + '/api/auth/login', credentials).then(function(response) {
        if (response.data.token) {
          $window.localStorage.setItem(tokenKey, response.data.token);
          $window.localStorage.setItem(userKey, JSON.stringify(response.data.user));
          return response.data;
        }
        throw new Error('Invalid login response');
      });
    };
    this.logout = function() {
      $window.localStorage.removeItem(tokenKey);
      $window.localStorage.removeItem(userKey);
    };
    this.getToken = function() {
      return $window.localStorage.getItem(tokenKey);
    };
    this.isAuthenticated = function() {
      return !!self.getToken();
    };
    this.getUserRole = function() {
      var userData = $window.localStorage.getItem(userKey);
      if (userData) {
        try {
          return JSON.parse(userData).role;
        } catch (e) {
          return null;
        }
      }
      return null;
    };
    this.getUserData = function() {
      var userData = $window.localStorage.getItem(userKey);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          return null;
        }
      }
      return null;
    };
  }]);
})();