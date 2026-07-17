'use strict';

(function () {
  angular
    .module('davBankingInsightsApp')
    .factory('ApiInterceptorService', ApiInterceptorService);

  ApiInterceptorService.$inject = ['$q', 'SecurityContextService', 'LoggingService', 'ErrorHandlerService'];

  function ApiInterceptorService($q, SecurityContextService, LoggingService, ErrorHandlerService) {
    return {
      request: onRequest,
      response: onResponse,
      responseError: onResponseError
    };

    function onRequest(config) {
      var user = SecurityContextService.getUser();
      config.headers = config.headers || {};
      if (user && user.token) {
        config.headers.Authorization = 'Bearer ' + user.token;
      }
      config.headers['X-Correlation-Id'] = config.headers['X-Correlation-Id'] || generateCorrelationId();
      return config;
    }

    function onResponse(response) {
      return response;
    }

    function onResponseError(rejection) {
      var errorCode;
      if (rejection.status === 0) {
        errorCode = 'NETWORK';
      } else if (rejection.status === 401 || rejection.status === 403) {
        errorCode = 'AUTH';
      } else {
        errorCode = 'UNKNOWN';
      }
      var handled = ErrorHandlerService.handle({
        code: errorCode,
        status: rejection.status,
        original: rejection
      }, 'http');
      LoggingService.error('HTTP error', handled);
      return $q.reject(rejection);
    }

    function generateCorrelationId() {
      return 'cid-' + Math.random().toString(36).substr(2, 9);
    }
  }
})();
