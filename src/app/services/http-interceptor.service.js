(function() {
  'use strict';
  angular.module('fraudDetectionApp')
    .factory('HttpInterceptorService', ['$q', '$injector', function($q, $injector) {
      return {
        request: function(config) {
          var token = sessionStorage.getItem('authToken');
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
          if (rejection.status === 401) {
            var $window = $injector.get('$window');
            $window.location.href = '/login';
          } else if (rejection.status >= 500) {
            var retryCount = rejection.config.retryCount || 0;
            if (retryCount < 2) {
              rejection.config.retryCount = retryCount + 1;
              var $http = $injector.get('$http');
              return $http(rejection.config);
            }
          }
          return $q.reject(rejection);
        }
      };
    }]);
})();