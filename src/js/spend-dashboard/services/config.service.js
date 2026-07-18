(function() {
  'use strict';

  function ConfigService($http, $q) {
    var config = null;
    var useMockData = true; // Default to mock mode
    
    var mockConfig = {
      apiBaseUrl: '/api/davms',
      telemetryEndpoint: '/telemetry',
      featureFlags: {
        enhancedBreakdown: false,
        showDataFreshness: true
      }
    };

    function loadConfig() {
      if (config) {
        return $q.resolve(config);
      }

      if (useMockData) {
        config = mockConfig;
        return $q.resolve(config);
      }

      return $http.get('config/env.prod.json')
        .then(function(response) {
          config = response.data;
          return config;
        })
        .catch(function() {
          config = mockConfig;
          return config;
        });
    }

    return {
      getApiBaseUrl: function() {
        return loadConfig().then(function(cfg) {
          return cfg.apiBaseUrl;
        });
      },
      
      isFeatureEnabled: function(flagName) {
        return loadConfig().then(function(cfg) {
          return !!(cfg.featureFlags && cfg.featureFlags[flagName]);
        });
      },
      
      getTelemetryEndpoint: function() {
        return loadConfig().then(function(cfg) {
          return cfg.telemetryEndpoint;
        });
      },
      
      setMockMode: function(enabled) {
        useMockData = enabled;
        config = null; // Reset config to reload
      },
      
      isMockMode: function() {
        return useMockData;
      }
    };
  }

  ConfigService.$inject = ['$http', '$q'];

  angular.module('davms.spendDashboard')
    .service('ConfigService', ConfigService);
})();