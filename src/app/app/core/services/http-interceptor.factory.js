(function () {
  'use strict';

  angular
    .module('ccd.core')
    .factory('httpInterceptor', [
      '$q',
      '$injector',
      '$rootScope',
      function ($q, $injector, $rootScope) {
        return {
          request: function (config) {
            var authTokenService = $injector.get('authTokenService');
            var loggingService = $injector.get('loggingService');

            if (!config.headers) {
              config.headers = {};
            }

            var token = authTokenService.getAccessToken();
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }

            var correlationId = $rootScope.correlationId;
            if (correlationId) {
              config.headers['X-Correlation-Id'] = correlationId;
            }

            if (config.url && config.url.indexOf('http:') === 0) {
              loggingService.warn('Blocked non-HTTPS request: ' + config.url);
              return $q.reject({
                status: 0,
                data: null,
                config: config
              });
            }

            return config;
          },
          response: function (response) {
            var loggingService = $injector.get('loggingService');
            loggingService.info('HTTP ' + response.status + ' ' + response.config.url);
            return response;
          },
          responseError: function (rejection) {
            var errorHandlerService = $injector.get('errorHandlerService');
            var loggingService = $injector.get('loggingService');
            var $rootScopeLocal = $injector.get('$rootScope');
            var authTokenService = $injector.get('authTokenService');

            var errorModel = errorHandlerService.handleHttpError(rejection);
            loggingService.error('HTTP error', { status: rejection.status }, errorModel);

            if (rejection.status === 401) {
              authTokenService.clear();
              $rootScopeLocal.$broadcast('auth:unauthorized', errorModel);
            }

            if (rejection.status === 403) {
              loggingService.audit('ACCESS_DENIED', {
                code: errorModel.code,
                correlationId: errorModel.correlationId
              });
            }

            return $q.reject(errorModel);
          }
        };
      }
    ]);
})();
