(function () {
  "use strict";

  loggingService.$inject = ["$log", "$injector", "ENV_CONFIG"];

  function loggingService($log, $injector, ENV_CONFIG) {
    let httpInstance = null;

    const service = {
      info: info,
      warn: warn,
      error: error,
      debug: debug
    };

    function getHttp() {
      if (!httpInstance) {
        httpInstance = $injector.get("$http");
      }
      return httpInstance;
    }

    function info(message, context) {
      $log.info(message, context || {});
      sendRemote("info", message, context);
    }

    function warn(message, context) {
      $log.warn(message, context || {});
      sendRemote("warn", message, context);
    }

    function error(message, context) {
      $log.error(message, context || {});
      sendRemote("error", message, context);
    }

    function debug(message, context) {
      $log.debug(message, context || {});
      sendRemote("debug", message, context);
    }

    function sendRemote(level, message, context) {
      if (!ENV_CONFIG.telemetry.enabled || !ENV_CONFIG.telemetry.endpointUrl) {
        return;
      }
      const payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };
      // Fire-and-forget; no response handling
      getHttp().post(ENV_CONFIG.telemetry.endpointUrl, payload).catch(function () {
        // Swallow logging errors
      });
    }

    return service;
  }

  angular
    .module("app")
    .service("loggingService", loggingService);
})();
