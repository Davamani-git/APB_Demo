(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .factory('httpInterceptor', ['$q', '$injector', function($q, $injector) {
      let retryCount = 0;
      const maxRetries = 3;
      return {
        request: function(config) {
          const token = sessionStorage.getItem('authToken');
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
          retryCount = 0;
          return response;
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            window.location.href = '/login';
            return $q.reject(rejection);
          }
          if (rejection.status >= 500 && retryCount < maxRetries) {
            retryCount++;
            const $http = $injector.get('$http');
            return $http(rejection.config);
          }
          if (rejection.status === -1) {
            rejection.message = 'Network error - please check your connection';
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();