(function() {
  'use strict';
  angular.module('creditCardDashboardModule')
    .factory('AuthInterceptor', ['$q', '$window', function($q, $window) {
      return {
        request: function(config) {
          const token = $window.localStorage.getItem('jwtToken');
          if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.error('Unauthorized access - please login');
          } else if (rejection.status === 500) {
            console.error('Server error - please try again later');
          } else if (rejection.status === 0) {
            console.error('Network error - please check your connection');
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();