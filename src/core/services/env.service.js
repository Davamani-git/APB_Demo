(function () {
  "use strict";

  EnvService.$inject = ["ENV_CONFIG", "$q", "$timeout", "$http", "$log"];

  function EnvService(ENV_CONFIG, $q, $timeout, $http, $log) {
    var initialized = false;

    var service = {
      initialize: initialize,
      getApiBaseUrl: getApiBaseUrl,
      getApiTimeoutMs: getApiTimeoutMs,
      getMaxLookbackMonths: getMaxLookbackMonths,
      isMockMode: isMockMode,
      getFeatureFlags: getFeatureFlags,
      getTelemetryConfig: getTelemetryConfig
    };

    return service;

    function initialize() {
      if (initialized) {
        return $q.when(true);
      }

      var deferred = $q.defer();

      // Simulate environment loading (can be replaced with real HTTP call if needed)
      $timeout(function () {
        initialized = true;
        $log.debug("Environment initialized", ENV_CONFIG);
        deferred.resolve(true);
      }, 0);

      return deferred.promise;
    }

    function getApiBaseUrl() {
      return ENV_CONFIG.apiBaseUrl;
    }

    function getApiTimeoutMs() {
      return ENV_CONFIG.apiTimeoutMs;
    }

    function getMaxLookbackMonths() {
      return ENV_CONFIG.maxLookbackMonths;
    }

    function isMockMode() {
      return ENV_CONFIG.useMockData === true;
    }

    function getFeatureFlags() {
      return ENV_CONFIG.featureFlags;
    }

    function getTelemetryConfig() {
      return ENV_CONFIG.telemetry;
    }
  }

  angular.module("app")
    .service("EnvService", EnvService);
})();
