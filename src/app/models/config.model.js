(function () {
    'use strict';

    function ConfigModel(envConfig) {
        this.apiBaseUrl = envConfig.apiBaseUrl;
        this.apiTimeoutMs = envConfig.apiTimeoutMs;
        this.maxLookbackMonths = envConfig.maxLookbackMonths;
        this.useMockData = envConfig.useMockData;
        this.featureFlags = envConfig.featureFlags;
        this.telemetry = envConfig.telemetry;
    }

    angular.module('app')
        .factory('ConfigModel', ConfigModelFactory);

    ConfigModelFactory.$inject = ['ENV_CONFIG'];

    function ConfigModelFactory(ENV_CONFIG) {
        return new ConfigModel(ENV_CONFIG);
    }
})();
