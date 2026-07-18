(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .factory('HttpInterceptor', HttpInterceptor);

  HttpInterceptor.$inject = ['$q', '$injector', 'ERROR_CODES'];

  function HttpInterceptor($q, $injector, ERROR_CODES) {
    return {
      request: function(config) {
        try {
          var EnvConfigService = $injector.get('EnvConfigService');
          var env = EnvConfigService.getEnvConfig();
          if (env && env.apiTimeoutMs) {
            config.timeout = env.apiTimeoutMs;
          }
        } catch (e) {}

        // Authorization header placeholder (token provider not implemented in LLD)
        if (!config.headers) {
          config.headers = {};
        }

        return config;
      },
      response: function(response) {
        return response;
      },
      responseError: function(rejection) {
        var ErrorModel = $injector.get('ErrorModel');
        var LoggingService = $injector.get('LoggingService');
        var TelemetryService = $injector.get('TelemetryService');

        var httpStatus = rejection.status;
        var code;
        var message;

        if (httpStatus === 400) {
          code = ERROR_CODES.BAD_REQUEST;
          message = 'Invalid request sent to the spending summary service.';
        } else if (httpStatus === 401) {
          code = ERROR_CODES.UNAUTHORIZED;
          message = 'Authentication required to view this summary.';
        } else if (httpStatus === 403) {
          code = ERROR_CODES.FORBIDDEN;
          message = 'You are not authorized to view this credit card summary.';
        } else if (httpStatus === 404) {
          code = ERROR_CODES.NOT_FOUND;
          message = 'No spending summary available for the selected month.';
        } else if (httpStatus === 500) {
          code = ERROR_CODES.SERVER_ERROR;
          message = 'An unexpected error occurred while retrieving your monthly summary.';
        } else {
          code = ERROR_CODES.NETWORK_ERROR;
          message = 'Unable to reach the spending summary service.';
        }

        var errorModel = new ErrorModel({
          code: code,
          httpStatus: httpStatus || null,
          message: message,
          details: rejection && rejection.data ? JSON.stringify(rejection.data) : null,
          retryable: code === ERROR_CODES.NETWORK_ERROR
        });

        LoggingService.error('HTTP error', errorModel);
        TelemetryService.trackEvent('MONTHLY_SUMMARY_FAILURE', { errorCode: code, status: httpStatus });

        return $q.reject(errorModel);
      }
    };
  }
})();
