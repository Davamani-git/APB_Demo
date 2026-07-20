(function () {
  'use strict';

  angular.module('apbDemo')
    .service('EnvConfigService', EnvConfigService);

  EnvConfigService.$inject = ['$injector', '$q'];
  function EnvConfigService($injector, $q) {
    var config = null;

    this.loadConfig = function (envName) {
      if (config) {
        return $q.resolve();
      }

      var deferred = $q.defer();
      var $http = $injector.get('$http');

      $http.get('config/env.default.json')
        .then(function (response) {
          config = response.data || {};

          if (envName) {
            var overridePath = 'config/env.' + envName + '.json';
            return $http.get(overridePath).then(function (overrideResponse) {
              var overrideConfig = overrideResponse.data || {};
              config = angular.extend({}, config, overrideConfig);
              deferred.resolve();
            }).catch(function () {
              deferred.resolve();
            });
          }

          deferred.resolve();
        })
        .catch(function () {
          config = {
            apiBaseUrl: '',
            apiTimeoutMs: 30000,
            maxLookbackMonths: 12,
            useMockData: true,
            featureFlags: {},
            telemetry: {},
            analyticsUrl: '#'
          };
          deferred.resolve();
        });

      return deferred.promise;
    };

    this.getApiBaseUrl = function () {
      return (config && config.apiBaseUrl) || '';
    };

    this.getApiTimeoutMs = function () {
      return (config && config.apiTimeoutMs) || 30000;
    };

    this.getMaxLookbackMonths = function () {
      return (config && config.maxLookbackMonths) || 12;
    };

    this.getUseMockData = function () {
      return !!(config && config.useMockData);
    };

    this.getFeatureFlags = function () {
      return (config && config.featureFlags) || {};
    };

    this.getTelemetry = function () {
      return (config && config.telemetry) || {};
    };

    this.getAnalyticsUrl = function () {
      return (config && config.analyticsUrl) || '#';
    };
  }
})();
