(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('AuthService', ['$window', '$http', function($window, $http) {
      var self = this;
      self.getToken = function() {
        return $window.sessionStorage.getItem('authToken') || 'mock-token-12345';
      };
      self.validateSession = function() {
        var token = self.getToken();
        return !!token;
      };
      self.refreshToken = function() {
        return $http.post('/api/auth/refresh', {}).then(function(response) {
          if (response.data && response.data.token) {
            $window.sessionStorage.setItem('authToken', response.data.token);
          }
          return response.data;
        });
      };
    }]);
})();