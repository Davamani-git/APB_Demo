(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .factory('HttpInterceptor', HttpInterceptor);

  HttpInterceptor.$inject = ['$q', 'AuthService', 'ErrorHandlerService'];

  function HttpInterceptor($q, AuthService, ErrorHandlerService) {
    return {
      request: function (config) {
        const token = AuthService.getToken();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        config.headers['X-Correlation-Id'] = generateCorrelationId();
        return config;
      },
      responseError: function (rejection) {
        const standardError = ErrorHandlerService.handleHttpError(rejection);
        return $q.reject(standardError);
      }
    };

    function generateCorrelationId() {
      return 'corr-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
    }
  }
})();
