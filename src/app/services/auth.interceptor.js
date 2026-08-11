(function() {
  'use strict';
  angular.module('onlineShoppingApp').factory('AuthInterceptor', ['$q', '$injector', '$window', AuthInterceptor]);
  function AuthInterceptor($q, $injector, $window) {
    return {
      request: function(config) {
        var token = $window.localStorage.getItem('authToken');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          var AuthService = $injector.get('AuthService');
          AuthService.logout();
          var $location = $injector.get('$location');
          $location.path('/');
        }
        return $q.reject(rejection);
      }
    };
  }
})();