(function () {
  "use strict";

  telemetryService.$inject = ["ENV_CONFIG"];

  function telemetryService(ENV_CONFIG) {
    let initialized = false;
    let context = {};

    const service = {
      initialize: initialize,
      trackEvent: trackEvent,
      trackError: trackError
    };

    function initialize(initContext) {
      context = angular.extend({}, initContext);
      initialized = true;
    }

    function trackEvent(name, properties) {
      if (!ENV_CONFIG.telemetry.enabled) {
        return;
      }
      const payload = {
        type: "event",
        name: name,
        context: context,
        properties: properties || {},
        timestamp: new Date().toISOString()
      };
      console.log("Telemetry event", payload);
    }

    function trackError(name, error, properties) {
      if (!ENV_CONFIG.telemetry.enabled) {
        return;
      }
      const payload = {
        type: "error",
        name: name,
        context: context,
        error: error,
        properties: properties || {},
        timestamp: new Date().toISOString()
      };
      console.error("Telemetry error", payload);
    }

    return service;
  }

  angular
    .module("app")
    .service("telemetryService", telemetryService);
})();
