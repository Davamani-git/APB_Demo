(function () {
  "use strict";

  HttpConfigInterceptor.$inject = ["$q", "$injector"];

  function HttpConfigInterceptor($q, $injector) {
    return {
      request: function (config) {
        var correlationId = generateCorrelationId();
        config.headers = config.headers || {};
        config.headers["X-Correlation-ID"] = correlationId;
        return config;
      },
      response: function (response) {
        return response;
      },
      requestError: function (rejection) {
        var loggingService = getLoggingService();
        loggingService.error("HTTP request error", { rejection: rejection });
        return $q.reject(rejection);
      },
      responseError: function (rejection) {
        var loggingService = getLoggingService();
        loggingService.error("HTTP response error", { rejection: rejection });
        return $q.reject(rejection);
      }
    };

    function generateCorrelationId() {
      return "corr-" + Math.random().toString(36).substring(2) + Date.now();
    }

    function getLoggingService() {
      return $injector.get("LoggingService");
    }
  }

  angular
    .module("app")
    .factory("HttpConfigInterceptor", HttpConfigInterceptor);
}());
