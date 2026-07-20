(function () {
    'use strict';

    // These are fallback constants in case the JSON load fails.
    // The primary source of truth is env.default.json loaded by EnvConfigService.
    angular
        .module('app')
        .constant('ENV_CONFIG', {
            apiBaseUrl: '/api',
            apiTimeoutMs: 15000,
            useMockData: true,
            debugMode: true,
            featureFlags: {
                enableBudget: true,
                enableAnalytics: true
            },
            telemetry: {
                enabled: false
            }
        });

})();