(function() {
  'use strict';
  angular.module('energyDashboard')
    .service('AuthService', ['$window', function($window) {
      this.getToken = function() {
        return $window.localStorage.getItem('auth_token') || 'demo-jwt-token';
      };
      this.setToken = function(token) {
        $window.localStorage.setItem('auth_token', token);
      };
      this.removeToken = function() {
        $window.localStorage.removeItem('auth_token');
      };
      this.isAuthenticated = function() {
        return !!this.getToken();
      };
    }]);
})();