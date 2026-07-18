(function() {
  'use strict';

  LoggingService.$inject = ['$log', '$http', 'ConfigService'];

  function LoggingService($log, $http, ConfigService) {
    var self = this;

    self.info = info;
    self.warn = warn;
    self.error = error;

    function info(message, context) {
      $log.info(message, context);
      sendRemote('INFO', message, context);
    }

    function warn(message, context) {
      $log.warn(message, context);
      sendRemote('WARN', message, context);
    }

    function error(message, context) {
      $log.error(message, context);
      sendRemote('ERROR', message, context);
    }

    function sendRemote(level, message, context) {
      var endpoint = ConfigService.getTelemetryEndpoint();
      if (!endpoint) {
        return;
      }
      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };
      $http.post(endpoint + '/logs', payload).catch(function() {
        // Swallow remote logging failures.
      });
    }
  }

  angular.module('davms.spendDashboard')
    .service('LoggingService', LoggingService);
})();
