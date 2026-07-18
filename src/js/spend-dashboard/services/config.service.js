(function() {
  'use strict';

  ConfigService.$inject = ['$http'];

  function ConfigService($http) {
    var self = this;
    var envConfig = null;

    self.getApiBaseUrl = getApiBaseUrl;
    self.isFeatureEnabled = isFeatureEnabled;
    self.getTelemetryEndpoint = getTelemetryEndpoint;
    self.getUseMockData = getUseMockData;

    loadEnvConfig();

    function loadEnvConfig() {
      var envFile = 'config/env.dev.json';
      $http.get(envFile).then(function(response) {
        envConfig = response.data || {};
      }).catch(function() {
        envConfig = {
          apiBaseUrl: '',
          telemetryEndpoint: '',
          featureFlags: {},
          useMockData: true
        };
      });
    }

    function getApiBaseUrl() {
      if (!envConfig || !envConfig.apiBaseUrl) {
        return '';
      }
      return envConfig.apiBaseUrl;
    }

    function isFeatureEnabled(flagName) {
      if (!envConfig || !envConfig.featureFlags) {
        return false;
      }
      return !!envConfig.featureFlags[flagName];
    }

    function getTelemetryEndpoint() {
      if (!envConfig || !envConfig.telemetryEndpoint) {
        return '';
      }
      return envConfig.telemetryEndpoint;
    }

    function getUseMockData() {
      if (!envConfig || typeof envConfig.useMockData === 'undefined') {
        return true;
      }
      return !!envConfig.useMockData;
    }
  }

  angular.module('davms.spendDashboard')
    .service('ConfigService', ConfigService);
})();
