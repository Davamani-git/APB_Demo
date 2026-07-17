(function () {
  'use strict';

  angular.module('app.core')
    .service('telemetryService', ['$http', 'envConfig', 'loggingConfig', function ($http, envConfig, loggingConfig) {
      var correlationId = generateCorrelationId();

      function generateCorrelationId() {
        // Simple UUIDv4-like generator for client-side correlation
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }

      function safeLog(payload) {
        // In mock mode, no real HTTP call is required; keep interface consistent
        if (envConfig.useMockApi) {
          return;
        }
        try {
          var redactedPayload = angular.copy(payload);
          loggingConfig.redactFields.forEach(function (field) {
            if (redactedPayload[field]) {
              redactedPayload[field] = 'REDACTED';
            }
          });
          $http.post(loggingConfig.endpoint, redactedPayload);
        } catch (e) {
          // Swallow logging errors
        }
      }

      this.getCorrelationId = function () {
        return correlationId;
      };

      this.beginNavigation = function (path) {
        safeLog({
          type: 'NAV_START',
          path: path,
          correlationId: correlationId
        });
      };

      this.endNavigation = function (path) {
        safeLog({
          type: 'NAV_END',
          path: path,
          correlationId: correlationId
        });
      };

      this.logHttpError = function (error) {
        safeLog({
          type: 'HTTP_ERROR',
          code: error.code,
          status: error.httpStatus,
          correlationId: error.correlationId || correlationId
        });
      };

      this.logSecurityEvent = function (code, details) {
        safeLog({
          type: 'SECURITY',
          code: code,
          details: details || {},
          correlationId: correlationId
        });
      };

      this.logNavigation = function (eventCode, details) {
        safeLog({
          type: 'NAV_EVENT',
          code: eventCode,
          details: details || {},
          correlationId: correlationId
        });
      };
    }]);
}());
