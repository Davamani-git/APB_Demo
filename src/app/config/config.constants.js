(function () {
    "use strict";

    var ENV_CONFIG = {
        apiBaseUrl: "/api",
        apiTimeoutMs: 15000,
        useMockData: true,
        maxLookbackMonths: 12,
        defaultMonthOffset: 0,
        featureFlags: {
            enableCategoryDrilldown: true,
            enableMultiMonthComparison: true
        },
        telemetry: {
            enableClientLogging: true
        }
    };

    angular.module("app")
        .constant("ENV_CONFIG", ENV_CONFIG);
})();
