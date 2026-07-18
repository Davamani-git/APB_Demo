(function () {
  'use strict';

  var useMockData = true;

  ConfigService.$inject = ['$http', '$q'];

  function ConfigService($http, $q) {
    var self = this;

    self._envConfig = null;
    self._configLoadedPromise = null;

    self._loadConfig = function () {
      if (self._configLoadedPromise) {
        return self._configLoadedPromise;
      }

      if (useMockData) {
        var mockConfig = {
          apiBaseUrl: 'https://mock-api.bank.com/davms',
          telemetryEndpoint: 'https://mock-telemetry.bank.com',
          featureFlags: {
            enhancedBreakdown: true,
            showDataFreshness: true
          }
        };
        self._envConfig = mockConfig;
        self._configLoadedPromise = $q.resolve(mockConfig);
        return self._configLoadedPromise;
      }

      var envFile = 'config/env.prod.json';
      self._configLoadedPromise = $http.get(envFile).then(function (response) {
        self._envConfig = response.data;
        return self._envConfig;
      });

      return self._configLoadedPromise;
    };

    self.getApiBaseUrl = function () {
      if (self._envConfig) {
        return self._envConfig.apiBaseUrl;
      }
      return '';
    };

    self.getTelemetryEndpoint = function () {
      if (self._envConfig) {
        return self._envConfig.telemetryEndpoint;
      }
      return '';
    };

    self.isFeatureEnabled = function (flagName) {
      if (!self._envConfig || !self._envConfig.featureFlags) {
        return false;
      }
      return !!self._envConfig.featureFlags[flagName];
    };

    self.ensureLoaded = function () {
      return self._loadConfig();
    };
  }

  angular.module('davms.spendDashboard')
    .service('ConfigService', ConfigService);
})();
