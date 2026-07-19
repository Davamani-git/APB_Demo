(function () {
  'use strict';

  EnvConfigService.$inject = ['$http', '$q'];

  angular.module('app')
    .service('EnvConfigService', EnvConfigService);

  function EnvConfigService($http, $q) {
    var self = this;
    var config = null;

    self.load = function () {
      if (config) {
        return $q.resolve(config);
      }
      return $http.get('config/env.config.json').then(function (response) {
        config = response.data;
        return config;
      });
    };

    self.getConfig = function () {
      return config;
    };

    self.getApiBaseUrl = function () {
      return config ? config.apiBaseUrl : '';
    };

    self.getApiTimeoutMs = function () {
      return config ? config.apiTimeoutMs : 0;
    };

    self.getMaxLookbackMonths = function () {
      return config ? config.maxLookbackMonths : 0;
    };

    self.useMockData = function () {
      return !!(config && config.useMockData);
    };

    self.getFeatureFlags = function () {
      return config ? config.featureFlags : {};
    };

    self.getTelemetryConfig = function () {
      return config ? config.telemetry : {};
    };
  }
})();
