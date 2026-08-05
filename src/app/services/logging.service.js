(function () {
  'use strict';

  angular
    .module('execSummary.services')
    .service('LoggingService', ['ENV_CONFIG', 'FEATURE_FLAGS', 'LOGGING_CONFIG', 'StorageService', '$log', function (ENV_CONFIG, FEATURE_FLAGS, LOGGING_CONFIG, StorageService, $log) {
      var auditBuffer = [];

      function logToConsole(level, message, context) {
        if (!LOGGING_CONFIG.enableConsole) {
          return;
        }
        if (level === 'info' && $log.info) {
          $log.info(message, context);
        } else if (level === 'warn' && $log.warn) {
          $log.warn(message, context);
        } else if (level === 'error' && $log.error) {
          $log.error(message, context);
        } else if ($log.log) {
          $log.log(message, context);
        }
      }

      this.info = function (message, context) {
        logToConsole('info', message, context);
      };

      this.warn = function (message, context) {
        logToConsole('warn', message, context);
      };

      this.error = function (message, context) {
        logToConsole('error', message, context);
      };

      this.audit = function (eventType, payload) {
        var event = {
          eventType: eventType,
          payload: payload,
          timestamp: new Date().toISOString()
        };
        auditBuffer.push(event);
        if (auditBuffer.length > LOGGING_CONFIG.maxAuditEvents) {
          auditBuffer.shift();
        }
        if (FEATURE_FLAGS.enableAuditPersistence) {
          StorageService.save(ENV_CONFIG.storageKeyLogs, auditBuffer);
        }
      };

      this.getAuditBuffer = function () {
        return auditBuffer.slice();
      };

      this.clearAuditBuffer = function () {
        auditBuffer = [];
        if (FEATURE_FLAGS.enableAuditPersistence) {
          StorageService.save(ENV_CONFIG.storageKeyLogs, auditBuffer);
        }
      };
    }]);
})();