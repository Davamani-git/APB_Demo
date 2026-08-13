(function() {
  'use strict';
  angular.module('app.shopping')
    .factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          var token = $window.localStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            $window.localStorage.removeItem('authToken');
            $window.localStorage.removeItem('user');
            $window.location.href = '#/login';
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();