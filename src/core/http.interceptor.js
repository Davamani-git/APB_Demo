(function () {
  'use strict';

  angular
    .module('apb.core')
    .factory('AuthHttpInterceptor', AuthHttpInterceptor);

  AuthHttpInterceptor.$inject = ['$q', '$injector'];

  function AuthHttpInterceptor($q, $injector) {
    return {
      request: function (config) {
        var AuthTokenService = $injector.get('AuthTokenService');
        var LoggerService = $injector.has('LoggerService') ? $injector.get('LoggerService') : null;
        var token = AuthTokenService.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        if (LoggerService) {
          LoggerService.info('HTTP request', { url: config.url, method: config.method });
        }
        return config;
      },
      responseError: function (rejection) {
        var LoggerService = $injector.has('LoggerService') ? $injector.get('LoggerService') : null;
        if (LoggerService) {
          LoggerService.error('HTTP response error', { status: rejection.status, data: rejection.data });
        }
        return $q.reject(rejection);
      }
    };
  }
})();
