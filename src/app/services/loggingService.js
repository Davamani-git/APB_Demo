(function () {
  'use strict';

  LoggingService.$inject = ['$log', '$injector'];

  function LoggingService($log, $injector) {
    function debug(message, context) {
      $log.debug(buildMessage(message, context));
    }

    function info(message, context) {
      $log.info(buildMessage(message, context));
    }

    function warn(message, context) {
      $log.warn(buildMessage(message, context));
    }

    function error(message, context) {
      $log.error(buildMessage(message, context));
    }

    function audit(event, context) {
      $log.info(buildMessage('AUDIT: ' + event, context));
    }

    function buildMessage(message, context) {
      var payload = {
        message: message,
        context: context || {}
      };
      try {
        return JSON.stringify(payload);
      } catch (e) {
        return message;
      }
    }

    return {
      debug: debug,
      info: info,
      warn: warn,
      error: error,
      audit: audit
    };
  }

  angular.module('app')
    .service('loggingService', LoggingService);
})();
