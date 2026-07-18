(function() {
  'use strict';

  function ConfigService($http) {
    var currentEnvConfig = null;
    var useMockDataFlag = true;

    var service = {
      loadEnvironmentConfig: loadEnvironmentConfig,
      getApiBaseUrl: getApiBaseUrl,
      isFeatureEnabled: isFeatureEnabled,
      getTelemetryEndpoint: getTelemetryEndpoint,
      useMockData: useMockData,
      setUseMockData: setUseMockData
    };

    return service;

    function loadEnvironmentConfig(envPath) {
      var path = envPath || 'config/env.dev.json';
      return $http.get(path).then(function(response) {
        currentEnvConfig = response.data || {};
        if (typeof currentEnvConfig.useMockData === 'boolean') {
          useMockDataFlag = currentEnvConfig.useMockData;
        }
        return currentEnvConfig;
      });
    }

    function getApiBaseUrl() {
      if (currentEnvConfig && currentEnvConfig.apiBaseUrl) {
        return currentEnvConfig.apiBaseUrl;
      }
      return '';
    }

    function isFeatureEnabled(flagName) {
      if (!currentEnvConfig || !currentEnvConfig.featureFlags) {
        return false;
      }
      return !!currentEnvConfig.featureFlags[flagName];
    }

    function getTelemetryEndpoint() {
      if (currentEnvConfig && currentEnvConfig.telemetryEndpoint) {
        return currentEnvConfig.telemetryEndpoint;
      }
      return '';
    }

    function useMockData() {
      return useMockDataFlag;
    }

    function setUseMockData(flag) {
      useMockDataFlag = !!flag;
    }
  }

  ConfigService.$inject = ['$http'];

  angular.module('davms.spendDashboard')
    .service('ConfigService', ConfigService);
})();
