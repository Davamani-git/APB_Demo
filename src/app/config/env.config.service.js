(function () {
  'use strict';

  angular.module('apbDemo')
    .service('EnvConfigService', EnvConfigService);

  EnvConfigService.$inject = ['$q', '$injector'];
  function EnvConfigService($q, $injector) {
    var service = this;
    var configLoaded = false;
    var configData = null;

    service.loadConfig = loadConfig;
    service.getApiBaseUrl = getApiBaseUrl;
    service.getApiTimeoutMs = getApiTimeoutMs;
    service.getMaxLookbackMonths = getMaxLookbackMonths;
    service.getUseMockData = getUseMockData;
    service.getFeatureFlags = getFeatureFlags;
    service.getTelemetry = getTelemetry;
    service.getAnalyticsUrl = getAnalyticsUrl;

    function loadConfig(envName) {
      var deferred = $q.defer();
      var $http = $injector.get('$http');

      if (configLoaded && configData) {
        deferred.resolve(configData);
        return deferred.promise;
      }

      var basePath = 'src/app/config/';
      var defaultConfigUrl = basePath + 'env.default.json';
      var envConfigUrl = null;

      if (envName === 'dev') {
        envConfigUrl = basePath + 'env.dev.json';
      } else if (envName === 'prod') {
        envConfigUrl = basePath + 'env.prod.json';
      }

      $http.get(defaultConfigUrl).then(function (response) {
        configData = response.data || {};
        if (envConfigUrl) {
          $http.get(envConfigUrl).then(function (envResponse) {
            var overlay = envResponse.data || {};
            configData = angular.extend({}, configData, overlay);
            configLoaded = true;
            deferred.resolve(configData);
          }, function () {
            configLoaded = true;
            deferred.resolve(configData);
          });
        } else {
          configLoaded = true;
          deferred.resolve(configData);
        }
      }, function (error) {
        configLoaded = false;
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function ensureConfig() {
      if (!configLoaded || !configData) {
        throw new Error('Environment configuration not loaded');
      }
    }

    function getApiBaseUrl() {
      ensureConfig();
      return configData.apiBaseUrl || '';
    }

    function getApiTimeoutMs() {
      ensureConfig();
      return configData.apiTimeoutMs || 30000;
    }

    function getMaxLookbackMonths() {
      ensureConfig();
      return configData.maxLookbackMonths || 12;
    }

    function getUseMockData() {
      ensureConfig();
      return !!configData.useMockData;
    }

    function getFeatureFlags() {
      ensureConfig();
      return configData.featureFlags || {};
    }

    function getTelemetry() {
      ensureConfig();
      return configData.telemetry || {};
    }

    function getAnalyticsUrl() {
      ensureConfig();
      return configData.analyticsUrl || '';
    }
  }
})();
