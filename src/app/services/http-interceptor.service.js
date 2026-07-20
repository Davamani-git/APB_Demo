(function () {
  'use strict';

  angular.module('apbDemo')
    .service('HttpInterceptorService', HttpInterceptorService);

  HttpInterceptorService.$inject = ['$q', '$injector', 'EnvConfigService'];

  function HttpInterceptorService($q, $injector, EnvConfigService) {
    var service = {
      request: onRequest,
      responseError: onResponseError
    };

    return service;

    function onRequest(config) {
      try {
        var telemetry = EnvConfigService.getTelemetry();
        var timeoutMs = EnvConfigService.getApiTimeoutMs();
        config.timeout = timeoutMs;
        if (telemetry && telemetry.authTokenHeader && telemetry.authTokenValue) {
          config.headers = config.headers || {};
          config.headers[telemetry.authTokenHeader] = telemetry.authTokenValue;
        }
      } catch (e) {
        // EnvConfig may not yet be fully loaded; allow request to proceed with defaults
      }
      return config;
    }

    function onResponseError(rejection) {
      var LoggingService = $injector.get('LoggingService');
      LoggingService.error('HTTP response error', { rejection: rejection });
      return $q.reject(rejection);
    }
  }
})();
