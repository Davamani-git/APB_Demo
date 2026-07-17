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
        var LoggerService = $injector.get('LoggerService');
        var token = AuthTokenService.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        LoggerService.info('HTTP request', { url: config.url, method: config.method });
        return config;
      },
      responseError: function (rejection) {
        var LoggerService = $injector.get('LoggerService');
        var AuthTokenService = $injector.get('AuthTokenService');
        LoggerService.error('HTTP response error', { status: rejection.status, data: rejection.data });

        if (rejection.status === 401 || rejection.status === 403) {
          AuthTokenService.clear();
        }

        return $q.reject(rejection);
      }
    };
  }
})();
