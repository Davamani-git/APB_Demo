(function () {
  'use strict';

  angular
    .module('apbDemo')
    .service('EnvConfigService', EnvConfigService);

  EnvConfigService.$inject = ['$q', '$injector'];
  function EnvConfigService($q, $injector) {
    var config = null;

    this.loadConfig = loadConfig;
    this.getApiBaseUrl = getApiBaseUrl;
    this.getApiTimeoutMs = getApiTimeoutMs;
    this.getMaxLookbackMonths = getMaxLookbackMonths;
    this.getUseMockData = getUseMockData;
    this.getFeatureFlags = getFeatureFlags;
    this.getTelemetry = getTelemetry;
    this.getAnalyticsUrl = getAnalyticsUrl;

    function loadConfig(envName) {
      if (config) {
        return $q.resolve();
      }

      var deferred = $q.defer();
      var $http = $injector.get('$http');
      var basePath = 'src/app/config/';
      var defaultUrl = basePath + 'env.default.json';

      $http.get(defaultUrl).then(function (response) {
        config = response.data || {};
        if (envName) {
          var envUrl = basePath + 'env.' + envName + '.json';
          return $http.get(envUrl).then(function (envResponse) {
            var override = envResponse.data || {};
            config = angular.merge({}, config, override);
            deferred.resolve();
          }).catch(function () {
            deferred.resolve();
          });
        }
        deferred.resolve();
      }).catch(function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function ensureConfig() {
      if (!config) {
        throw new Error('ENV configuration has not been loaded yet');
      }
    }

    function getApiBaseUrl() {
      ensureConfig();
      return config.apiBaseUrl;
    }

    function getApiTimeoutMs() {
      ensureConfig();
      return config.apiTimeoutMs;
    }

    function getMaxLookbackMonths() {
      ensureConfig();
      return config.maxLookbackMonths;
    }

    function getUseMockData() {
      ensureConfig();
      return !!config.useMockData;
    }

    function getFeatureFlags() {
      ensureConfig();
      return config.featureFlags || {};
    }

    function getTelemetry() {
      ensureConfig();
      return config.telemetry || {};
    }

    function getAnalyticsUrl() {
      ensureConfig();
      return config.analyticsUrl;
    }
  }
})();
