(function() {
  'use strict';
  angular.module('onlineShoppingApp').service('AuthService', ['$http', '$window', AuthService]);
  function AuthService($http, $window) {
    var self = this;
    var API_BASE = 'https://api.shopping.com';
    self.login = function(credentials) {
      return $http.post(API_BASE + '/api/auth/login', credentials).then(function(response) {
        if (response.data && response.data.token) {
          $window.localStorage.setItem('authToken', response.data.token);
          $window.localStorage.setItem('user', JSON.stringify(response.data.user));
          return response.data;
        }
        throw new Error('Invalid response');
      });
    };
    self.logout = function() {
      $window.localStorage.removeItem('authToken');
      $window.localStorage.removeItem('user');
    };
    self.getToken = function() {
      return $window.localStorage.getItem('authToken');
    };
    self.getUser = function() {
      var user = $window.localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    };
    self.isAuthenticated = function() {
      return !!self.getToken();
    };
    self.autoLogin = function() {
      if (!self.isAuthenticated()) {
        var demoToken = 'demo-token-' + Date.now();
        var demoUser = { userId: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
        $window.localStorage.setItem('authToken', demoToken);
        $window.localStorage.setItem('user', JSON.stringify(demoUser));
      }
    };
  }
})();