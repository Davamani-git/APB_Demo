(function() {
  'use strict';
  angular.module('shoppingPlatform').factory('AuthInterceptor', ['$q', '$location', '$window', function($q, $location, $window) {
    return {
      request: function(config) {
        var token = $window.localStorage.getItem('auth_token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $window.localStorage.removeItem('auth_token');
          $window.localStorage.removeItem('user_data');
          $location.path('/login');
        } else if (rejection.status === 403) {
          alert('Access Denied: You do not have permission to perform this action.');
        }
        return $q.reject(rejection);
      }
    };
  }]);
})();