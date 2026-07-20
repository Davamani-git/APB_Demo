(function () {
  'use strict';

  angular
    .module('apbDemo')
    .factory('HttpInterceptorService', HttpInterceptorService);

  HttpInterceptorService.$inject = ['$q', '$injector'];
  function HttpInterceptorService($q, $injector) {
    return {
      request: onRequest,
      responseError: onResponseError
    };

    function onRequest(config) {
      var EnvConfigService = $injector.get('EnvConfigService');
      var LoggingService = $injector.get('LoggingService');

      var token = null;
      if (window && window.APB_AUTH && window.APB_AUTH.token) {
        token = window.APB_AUTH.token;
      }
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }

      try {
        var timeoutMs = EnvConfigService.getApiTimeoutMs();
        if (timeoutMs && !config.timeout) {
          var $timeout = $injector.get('$timeout');
          config.timeout = $timeout(timeoutMs);
        }
      } catch (e) {
        // ignore
      }

      LoggingService.info('HTTP request', { url: config.url, method: config.method });
      return config;
    }

    function onResponseError(rejection) {
      var LoggingService = $injector.get('LoggingService');
      var ErrorHandlingService = $injector.get('ErrorHandlingService');

      var errorModel = ErrorHandlingService.handleError(rejection, 'HTTP_INTERCEPTOR');
      LoggingService.error('HTTP response error', { error: errorModel });

      return $q.reject(rejection);
    }
  }
})();
