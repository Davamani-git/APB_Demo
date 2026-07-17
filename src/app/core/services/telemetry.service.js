(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .service('TelemetryService', TelemetryService);

  TelemetryService.$inject = ['ApiGatewayService'];

  function TelemetryService(ApiGatewayService) {
    this.emit = function (level, message, meta) {
      const payload = {
        level: level,
        message: message,
        meta: meta || {},
        timestamp: new Date().toISOString()
      };
      // Fire and forget; ignore errors to avoid user impact.
      ApiGatewayService.post('LOGGING', '/events', payload).catch(function () { });
    };
  }
})();
