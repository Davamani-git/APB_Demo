(function() {
  'use strict';

  ConfigService.$inject = ['$http'];

  function ConfigService($http) {
    var configCache = null;

    function loadConfigIfNeeded() {
      if (configCache) {
        return Promise.resolve(configCache);
      }
      return $http.get('config/env.dev.json') // In real deployment, environment-specific path would be used.
        .then(function(response) {
          configCache = response.data || {};
          return configCache;
        });
    }

    this.getApiBaseUrl = function() {
      if (configCache && configCache.apiBaseUrl) {
        return configCache.apiBaseUrl;
      }
      // Fallback base URL if config still loading
      return 'https://dev-api.bank.com/davms';
    };

    this.isFeatureEnabled = function(flagName) {
      if (!configCache || !configCache.featureFlags) {
        return false;
      }
      return !!configCache.featureFlags[flagName];
    };

    // Expose async load method in case callers want explicit config load
    this.load = function() {
      return loadConfigIfNeeded();
    };
  }

  angular.module('davms.spendDashboard')
    .service('ConfigService', ConfigService);
})();
