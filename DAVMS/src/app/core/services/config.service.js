(function () {
  "use strict";

  configService.$inject = ["ENV_CONFIG"];

  function configService(ENV_CONFIG) {
    const service = {
      getApiBaseUrl: getApiBaseUrl,
      getApiTimeoutMs: getApiTimeoutMs,
      getMaxLookbackMonths: getMaxLookbackMonths,
      isMockModeEnabled: isMockModeEnabled,
      getFeatureFlags: getFeatureFlags,
      getTelemetryConfig: getTelemetryConfig
    };

    function getApiBaseUrl() {
      return ENV_CONFIG.apiBaseUrl;
    }

    function getApiTimeoutMs() {
      return ENV_CONFIG.apiTimeoutMs;
    }

    function getMaxLookbackMonths() {
      return ENV_CONFIG.maxLookbackMonths;
    }

    function isMockModeEnabled() {
      return !!ENV_CONFIG.useMockData;
    }

    function getFeatureFlags() {
      return ENV_CONFIG.featureFlags;
    }

    function getTelemetryConfig() {
      return ENV_CONFIG.telemetry;
    }

    return service;
  }

  angular
    .module("app")
    .service("configService", configService);
})();
