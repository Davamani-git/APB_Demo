(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['$injector', '$log', 'ENV_CONFIG'];

  function LoggingService($injector, $log, ENV_CONFIG) {
    var http;

    function getHttp() {
      if (!http) {
        http = $injector.get('$http');
      }
      return http;
    }

    this.info = function(message, meta) {
      if (ENV_CONFIG.telemetry.enableLogging) {
        $log.info(message, meta || {});
      }
    };

    this.error = function(message, meta) {
      if (ENV_CONFIG.telemetry.enableLogging) {
        $log.error(message, meta || {});
      }
    };

    this.audit = function(eventName, payload) {
      if (ENV_CONFIG.telemetry.enableLogging && ENV_CONFIG.telemetry.logLevel === 'info') {
        this.info('AUDIT: ' + eventName, payload);
      }
      // Future: use getHttp() to send audit logs to backend.
      getHttp();
    };
  }
})();
