(function() {
  'use strict';
  angular.module('energyDashboard')
    .factory('authInterceptor', ['$q', '$injector', function($q, $injector) {
      return {
        request: function(config) {
          const AuthService = $injector.get('AuthService');
          const token = AuthService.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        requestError: function(rejection) {
          return $q.reject(rejection);
        },
        response: function(response) {
          return response;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            const AuthService = $injector.get('AuthService');
            AuthService.removeToken();
            const $location = $injector.get('$location');
            $location.path('/login');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();