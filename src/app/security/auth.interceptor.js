(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .factory('authInterceptor', ['$q', '$injector', '$window', function($q, $injector, $window) {
      return {
        request: function(config) {
          var authService = $injector.get('authService');
          var token = authService.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401 || rejection.status === 403) {
            var authService = $injector.get('authService');
            var $location = $injector.get('$location');
            authService.logout();
            $location.path('/login');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();