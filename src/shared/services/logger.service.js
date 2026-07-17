(function () {
  'use strict';

  angular
    .module('apb.shared')
    .service('LoggerService', LoggerService);

  LoggerService.$inject = ['$log', '$http', 'LOGGING_CONFIG'];

  function LoggerService($log, $http, LOGGING_CONFIG) {
    var levels = ['INFO', 'WARN', 'ERROR'];

    var service = {
      info: info,
      warn: warn,
      error: error
    };

    return service;

    function shouldLog(level) {
      var configuredIndex = levels.indexOf(LOGGING_CONFIG.logLevel || 'INFO');
      var levelIndex = levels.indexOf(level);
      return levelIndex >= configuredIndex;
    }

    function logRemote(level, message, context) {
      if (!LOGGING_CONFIG.remoteLoggingEnabled || !LOGGING_CONFIG.remoteLoggingUrl) {
        return;
      }
      try {
        $http.post(LOGGING_CONFIG.remoteLoggingUrl, {
          level: level,
          message: message,
          context: context || {}
        });
      } catch (e) {
        // swallow logging failures
      }
    }

    function info(message, context) {
      if (shouldLog('INFO')) {
        $log.info(message, context || {});
        logRemote('INFO', message, context);
      }
    }

    function warn(message, context) {
      if (shouldLog('WARN')) {
        $log.warn(message, context || {});
        logRemote('WARN', message, context);
      }
    }

    function error(message, context) {
      if (shouldLog('ERROR')) {
        $log.error(message, context || {});
        logRemote('ERROR', message, context);
      }
    }
  }
})();
