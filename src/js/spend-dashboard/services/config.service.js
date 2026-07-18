(function() {
  'use strict';

  ConfigService.$inject = ['$http'];

  function ConfigService($http) {
    var configCache = null;

    function loadConfig() {
      if (configCache) {
        return Promise.resolve(configCache);
      }

      // Default to dev environment; environment switching is external to this epic.
      return $http.get('config/env.dev.json').then(function(response) {
        configCache = response.data || {};
        return configCache;
      });
    }

    this.getApiBaseUrl = function() {
      if (configCache && configCache.apiBaseUrl) {
        return configCache.apiBaseUrl;
      }
      return 'https://dev-api.bank.com/davms';
    };

    this.isFeatureEnabled = function(flagName) {
      if (!flagName) {
        return false;
      }
      var flags = (configCache && configCache.featureFlags) ? configCache.featureFlags : {};
      return !!flags[flagName];
    };

    this.getTelemetryEndpoint = function() {
      if (configCache && configCache.telemetryEndpoint) {
        return configCache.telemetryEndpoint;
      }
      return '';
    };

    this.load = loadConfig;
  }

  angular.module('davms.spendDashboard')
    .service('ConfigService', ConfigService);
})();
