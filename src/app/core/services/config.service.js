(function () {
  'use strict';

  ConfigService.$inject = ['ENV_CONFIG'];

  function ConfigService(ENV_CONFIG) {
    var service = {
      getEnvConfig: getEnvConfig,
      isMockMode: isMockMode,
      getApiBaseUrl: getApiBaseUrl,
      getApiTimeoutMs: getApiTimeoutMs,
      getMaxLookbackMonths: getMaxLookbackMonths,
      getFeatureFlags: getFeatureFlags
    };
    return service;

    function getEnvConfig() { return ENV_CONFIG; }
    function isMockMode() { return !!ENV_CONFIG.useMockData; }
    function getApiBaseUrl() { return ENV_CONFIG.apiBaseUrl; }
    function getApiTimeoutMs() { return ENV_CONFIG.apiTimeoutMs; }
    function getMaxLookbackMonths() { return ENV_CONFIG.maxLookbackMonths; }
    function getFeatureFlags() { return ENV_CONFIG.featureFlags; }
  }

  angular.module('davmsApp')
    .service('ConfigService', ConfigService);
})();
