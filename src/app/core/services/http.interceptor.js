(function () {
  'use strict';

  angular.module('app.core')
    .factory('httpInterceptor', ['$q', 'authTokenService', 'telemetryService', 'errorMapperService', 'envConfig',
      function ($q, authTokenService, telemetryService, errorMapperService, envConfig) {
        return {
          request: function (config) {
            if (!envConfig.useMockApi && config.url.indexOf(envConfig.apiBaseUrl) === 0) {
              var token = authTokenService.getToken();
              if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
              }
              var correlationId = telemetryService.getCorrelationId();
              if (correlationId) {
                config.headers['X-Correlation-Id'] = correlationId;
              }
            }
            return config;
          },
          responseError: function (rejection) {
            var clientError = errorMapperService.mapHttpError(rejection);
            telemetryService.logHttpError(clientError);
            return $q.reject(clientError);
          }
        };
      }
    ])
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
    }]);
}());
