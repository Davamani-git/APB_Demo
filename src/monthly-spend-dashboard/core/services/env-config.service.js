(function () {
  "use strict";

  EnvConfigService.$inject = ["$http", "$q", "LoggingService"];

  function EnvConfigService($http, $q, LoggingService) {
    var config = null;

    this.load = function () {
      if (config !== null) {
        return $q.resolve();
      }

      return $http.get("core/config/env.config.json", { cache: true })
        .then(function (response) {
          config = response.data || {};
          LoggingService.info("Environment configuration loaded", { config: config });
        })
        .catch(function (error) {
          LoggingService.error("Failed to load environment configuration", { error: error });
          return $q.reject(error);
        });
    };

    this.getApiBaseUrl = function () {
      return config && config.apiBaseUrl ? config.apiBaseUrl : "";
    };

    this.getApiTimeoutMs = function () {
      return config && typeof config.apiTimeoutMs === "number" ? config.apiTimeoutMs : 15000;
    };

    this.getMaxLookbackMonths = function () {
      return config && typeof config.maxLookbackMonths === "number" ? config.maxLookbackMonths : 24;
    };

    this.getFeatureFlags = function () {
      return config && config.featureFlags ? config.featureFlags : {};
    };

    this.getTelemetryConfig = function () {
      return config && config.telemetry ? config.telemetry : {};
    };

    this.isMockMode = function () {
      return !!(config && config.useMockData);
    };
  }

  angular
    .module("app")
    .service("EnvConfigService", EnvConfigService);
}());
