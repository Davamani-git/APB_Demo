(function() {
  'use strict';
  angular.module('fraudDetection')
    .factory('FraudApiInterceptor', ['$q', '$injector', function($q, $injector) {
      var retryCount = 0;
      var maxRetries = 3;
      return {
        request: function(config) {
          var AuthService = $injector.get('AuthService');
          if (config.url.indexOf('/api/') !== -1) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + AuthService.getToken();
          }
          return config;
        },
        responseError: function(rejection) {
          if (rejection.status === 500 || rejection.status === 503) {
            if (retryCount < maxRetries) {
              retryCount++;
              var $http = $injector.get('$http');
              return $http(rejection.config);
            }
          }
          retryCount = 0;
          return $q.reject(rejection);
        }
      };
    }]);
})();