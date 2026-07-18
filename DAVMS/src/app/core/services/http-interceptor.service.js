(function () {
  "use strict";

  httpInterceptor.$inject = ["$q", "telemetryService", "loggingService", "APP_CONSTANTS"];

  function httpInterceptor($q, telemetryService, loggingService, APP_CONSTANTS) {
    return {
      request: function (config) {
        // Attach common headers if needed
        config.headers = config.headers || {};
        config.headers["X-App-Name"] = "DAVMS";
        return config;
      },
      response: function (response) {
        telemetryService.trackEvent("http_success", {
          url: response.config.url,
          status: response.status
        });
        return response;
      },
      responseError: function (rejection) {
        const status = rejection.status;
        let code = APP_CONSTANTS.errorCodes.backendError;

        if (status === APP_CONSTANTS.httpStatus.badRequest) {
          code = APP_CONSTANTS.errorCodes.invalidMonthFormat;
        } else if (status === APP_CONSTANTS.httpStatus.forbidden) {
          code = APP_CONSTANTS.errorCodes.authorizationFailed;
        } else if (status === APP_CONSTANTS.httpStatus.notFound) {
          code = APP_CONSTANTS.errorCodes.summaryNotFound;
        }

        loggingService.error("HTTP error", {
          url: rejection.config ? rejection.config.url : "",
          status: status,
          code: code
        });

        telemetryService.trackError("http_error", {
          status: status,
          code: code
        }, {});

        return $q.reject(rejection);
      }
    };
  }

  angular
    .module("app")
    .factory("httpInterceptor", httpInterceptor);
})();
