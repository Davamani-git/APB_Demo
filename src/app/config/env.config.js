(function () {
    "use strict";

    var envConfig = {
        apiBaseUrl: "/api",
        apiTimeoutMs: 5000,
        maxLookbackMonths: 12,
        useMockData: true,
        featureFlags: {
            showAdvancedKpis: false
        },
        telemetry: {
            enableClientMetrics: true
        }
    };

    angular
        .module("app")
        .constant("ENV_CONFIG", envConfig);
})();
