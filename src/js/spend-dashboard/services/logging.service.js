(function() {
  'use strict';

  function LoggingService($log, $http, ConfigService) {
    var logQueue = [];
    var isRemoteLoggingEnabled = false;

    function sendToRemote(level, message, context) {
      if (!isRemoteLoggingEnabled) {
        return;
      }

      ConfigService.getTelemetryEndpoint().then(function(endpoint) {
        var logEntry = {
          timestamp: new Date().toISOString(),
          level: level,
          message: message,
          context: context || {},
          source: 'davms-client'
        };

        $http.post(endpoint + '/logs', logEntry)
          .catch(function(error) {
            $log.warn('Failed to send log to remote endpoint', error);
          });
      });
    }

    return {
      info: function(message, context) {
        $log.info('[DAVMS]', message, context);
        sendToRemote('info', message, context);
      },
      
      warn: function(message, context) {
        $log.warn('[DAVMS]', message, context);
        sendToRemote('warn', message, context);
      },
      
      error: function(message, context) {
        $log.error('[DAVMS]', message, context);
        sendToRemote('error', message, context);
      },
      
      debug: function(message, context) {
        $log.debug('[DAVMS]', message, context);
        sendToRemote('debug', message, context);
      },
      
      enableRemoteLogging: function() {
        isRemoteLoggingEnabled = true;
      },
      
      disableRemoteLogging: function() {
        isRemoteLoggingEnabled = false;
      }
    };
  }

  LoggingService.$inject = ['$log', '$http', 'ConfigService'];

  angular.module('davms.spendDashboard')
    .service('LoggingService', LoggingService);
})();