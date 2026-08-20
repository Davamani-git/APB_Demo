(function() {
  'use strict';
  angular.module('fraudDetection')
    .factory('AuthService', ['$window', function($window) {
      return {
        getToken: function() {
          return $window.localStorage.getItem('authToken') || 'mock-auth-token';
        },
        isAuthenticated: function() {
          return !!this.getToken();
        }
      };
    }]);
})();