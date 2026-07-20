(function () {
    'use strict';

    angular.module('apbDemo')
        .service('EnvConfigService', EnvConfigService);

    EnvConfigService.$inject = ['$http', '$q'];

    function EnvConfigService($http, $q) {
        var service = this;
        var envConfig = null;

        service.loadConfig = loadConfig;
        service.getApiBaseUrl = getApiBaseUrl;
        service.getApiTimeoutMs = getApiTimeoutMs;
        service.getMaxLookbackMonths = getMaxLookbackMonths;
        service.getUseMockData = getUseMockData;
        service.getFeatureFlags = getFeatureFlags;
        service.getTelemetryConfig = getTelemetryConfig;
        service.getAnalyticsUrl = getAnalyticsUrl;

        function loadConfig() {
            var deferred = $q.defer();
            if (envConfig) {
                deferred.resolve();
                return deferred.promise;
            }

            $http.get('config/env.default.json').then(function (response) {
                envConfig = response.data || {};
                deferred.resolve();
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getApiBaseUrl() {
            return envConfig && envConfig.apiBaseUrl ? envConfig.apiBaseUrl : '';
        }

        function getApiTimeoutMs() {
            return envConfig && envConfig.apiTimeoutMs ? envConfig.apiTimeoutMs : 30000;
        }

        function getMaxLookbackMonths() {
            return envConfig && envConfig.maxLookbackMonths ? envConfig.maxLookbackMonths : 12;
        }

        function getUseMockData() {
            return !!(envConfig && envConfig.useMockData);
        }

        function getFeatureFlags() {
            return envConfig && envConfig.featureFlags ? envConfig.featureFlags : {};
        }

        function getTelemetryConfig() {
            return envConfig && envConfig.telemetry ? envConfig.telemetry : {};
        }

        function getAnalyticsUrl() {
            return envConfig && envConfig.analyticsUrl ? envConfig.analyticsUrl : '#';
        }
    }
})();
