(function () {
    "use strict";

    ConfigModel.$inject = ["ENV_CONFIG"];

    function ConfigModel(ENV_CONFIG) {
        this.apiBaseUrl = ENV_CONFIG.apiBaseUrl;
        this.apiTimeoutMs = ENV_CONFIG.apiTimeoutMs;
        this.maxLookbackMonths = ENV_CONFIG.maxLookbackMonths;
        this.useMockData = ENV_CONFIG.useMockData;
        this.featureFlags = ENV_CONFIG.featureFlags;
        this.telemetry = ENV_CONFIG.telemetry;
    }

    angular.module("app")
        .service("ConfigModel", ConfigModel);
})();
