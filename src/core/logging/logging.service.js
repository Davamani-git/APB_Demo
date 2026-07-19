(function () {
  "use strict";

  LoggingService.$inject = ["$log", "$injector"];

  function LoggingService($log, $injector) {
    var service = {
      debug: debug,
      info: info,
      warn: warn,
      error: error
    };

    return service;

    function debug(message, context) {
      $log.debug(message, context || {});
    }

    function info(message, context) {
      $log.info(message, context || {});
    }

    function warn(message, context) {
      $log.warn(message, context || {});
    }

    function error(message, context) {
      $log.error(message, context || {});
      // Telemetry hook (disabled by default, can be enabled via ENV_CONFIG.telemetry)
      // var telemetryConfig = $injector.get("ENV_CONFIG").telemetry;
      // if (telemetryConfig && telemetryConfig.enableLogging) {
      //   var $http = $injector.get("$http");
      //   $http.post("/telemetry", { level: "error", message: message, context: context });
      // }
    }
  }

  angular.module("app")
    .service("LoggingService", LoggingService);
})();
