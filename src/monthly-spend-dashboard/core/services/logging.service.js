(function () {
  "use strict";

  LoggingService.$inject = ["$injector", "$window", "EnvConfigService"];

  function LoggingService($injector, $window, EnvConfigService) {
    var httpInstance = null;

    this.info = function (message, context) {
      log("info", message, context);
    };

    this.warn = function (message, context) {
      log("warn", message, context);
    };

    this.error = function (message, context) {
      log("error", message, context);
    };

    this.debug = function (message, context) {
      log("debug", message, context);
    };

    this.logToServer = function (level, message, context) {
      sendToServer(level, message, context);
    };

    function log(level, message, context) {
      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };

      if ($window.console && typeof $window.console.log === "function") {
        $window.console.log("[" + level.toUpperCase() + "]", message, context || {});
      }

      sendToServer(level, message, context);
    }

    function sendToServer(level, message, context) {
      var telemetry = EnvConfigService.getTelemetryConfig();
      if (!telemetry.enabled) {
        return;
      }

      var http = getHttp();
      if (!http) {
        return;
      }

      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };

      http.post(telemetry.endpoint, payload)
        .catch(function () {
          // Swallow logging errors to avoid affecting user experience
        });
    }

    function getHttp() {
      if (!httpInstance) {
        httpInstance = $injector.get("$http");
      }
      return httpInstance;
    }
  }

  angular
    .module("app")
    .service("LoggingService", LoggingService);
}());
