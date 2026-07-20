(function () {
  'use strict';

  angular.module('apbDemo')
    .service('HttpInterceptorService', HttpInterceptorService);

  HttpInterceptorService.$inject = ['$q', '$injector', 'EnvConfigService', 'LoggingService'];

  function HttpInterceptorService($q, $injector, EnvConfigService, LoggingService) {
    var service = {
      request: onRequest,
      response: onResponse,
      responseError: onResponseError
    };

    return service;

    function onRequest(config) {
      var telemetry = EnvConfigService.getTelemetry();
      if (telemetry && telemetry.enableRequestLogging) {
        LoggingService.info('HTTP request', { url: config.url, method: config.method });
      }

      var authTokenProvider = telemetry && telemetry.authTokenProvider;
      if (authTokenProvider && typeof authTokenProvider.getToken === 'function') {
        var token = authTokenProvider.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
      }

      return config;
    }

    function onResponse(response) {
      var telemetry = EnvConfigService.getTelemetry();
      if (telemetry && telemetry.enableResponseLogging) {
        LoggingService.info('HTTP response', { url: response.config.url, status: response.status });
      }
      return response;
    }

    function onResponseError(rejection) {
      LoggingService.error('HTTP response error', { url: rejection.config && rejection.config.url, status: rejection.status });
      var ErrorHandlingService = $injector.get('ErrorHandlingService');
      var errorModel = ErrorHandlingService.handleError(rejection, 'Global HTTP error');
      return $q.reject(errorModel);
    }
  }
})();
