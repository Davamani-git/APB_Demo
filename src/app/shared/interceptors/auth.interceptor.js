(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .factory('AuthInterceptor', ['$q', '$injector', function($q, $injector) {
      return {
        request: function(config) {
          const AuthService = $injector.get('AuthService');
          return AuthService.getToken()
            .then(function(token) {
              if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
              }
              return config;
            })
            .catch(function() {
              return config;
            });
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            const AuthService = $injector.get('AuthService');
            AuthService.clearToken();
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();