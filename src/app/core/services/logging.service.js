(function () {
  'use strict';

  LoggingService.$inject = ['$log', '$injector', 'TELEMETRY_CONFIG'];

  angular
    .module('app')
    .service('LoggingService', LoggingService);

  function LoggingService($log, $injector, TELEMETRY_CONFIG) {
    var self = this;

    self.debug = debug;
    self.info = info;
    self.warn = warn;
    self.error = error;
    self.audit = audit;

    function debug(message, context) {
      if (TELEMETRY_CONFIG.logLevel === 'debug') {
        $log.debug(message, context || {});
      }
    }

    function info(message, context) {
      $log.info(message, context || {});
    }

    function warn(message, context) {
      $log.warn(message, context || {});
    }

    function error(message, context) {
      $log.error(message, context || {});
    }

    function audit(eventName, metadata) {
      try {
        var $http = _getHttp();
        if (!$http) {
          return;
        }

        var payload = {
          eventName: eventName,
          metadata: metadata || {},
          timestamp: new Date().toISOString()
        };

        // Fire and forget; ignore failures
        $http.post('/audit/log', payload).catch(function () {
          // swallow error
        });
      } catch (e) {
        // Swallow any errors from audit logging
      }
    }

    function _getHttp() {
      try {
        return $injector.get('$http');
      } catch (e) {
        return null;
      }
    }
  }
})();
