(function () {
  'use strict';

  angular
    .module('apb.shared')
    .service('LoggerService', LoggerService);

  LoggerService.$inject = ['$log', '$http', 'LOGGING_CONFIG'];

  function LoggerService($log, $http, LOGGING_CONFIG) {
    var service = {
      info: info,
      warn: warn,
      error: error
    };

    return service;

    function info(message, context) {
      if (shouldLog('INFO')) {
        $log.info(message, context || {});
        remote('INFO', message, context);
      }
    }

    function warn(message, context) {
      if (shouldLog('WARN')) {
        $log.warn(message, context || {});
        remote('WARN', message, context);
      }
    }

    function error(message, context) {
      if (shouldLog('ERROR')) {
        $log.error(message, context || {});
        remote('ERROR', message, context);
      }
    }

    function shouldLog(level) {
      var order = { 'INFO': 1, 'WARN': 2, 'ERROR': 3 };
      var configured = LOGGING_CONFIG.logLevel || 'INFO';
      return order[level] >= order[configured];
    }

    function remote(level, message, context) {
      if (!LOGGING_CONFIG.remoteLoggingEnabled || !LOGGING_CONFIG.remoteLoggingUrl) {
        return;
      }
      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };
      try {
        $http.post(LOGGING_CONFIG.remoteLoggingUrl, payload);
      } catch (e) {
      }
    }
  }
})();
