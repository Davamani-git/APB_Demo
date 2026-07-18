(function () {
  'use strict';

  TelemetryService.$inject = ['ConfigService', 'LoggingService'];

  function TelemetryService(ConfigService, LoggingService) {
    var service = {
      trackEvent: trackEvent
    };
    return service;

    function trackEvent(name, payload) {
      var env = ConfigService.getEnvConfig();
      if (!env.telemetry.enabled) {
        return;
      }
      LoggingService.info('Telemetry event: ' + name, payload || {});
      // External telemetry endpoint integration could be added here without $http circular dependency.
    }
  }

  angular.module('davmsApp')
    .service('TelemetryService', TelemetryService);
})();
