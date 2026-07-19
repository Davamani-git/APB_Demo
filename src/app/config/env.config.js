(function () {
    'use strict';

    angular.module('app')
        .constant('ENV_CONFIG', {
            apiBaseUrl: '/api',
            apiTimeoutMs: 5000,
            maxLookbackMonths: 12,
            useMockData: true,
            featureFlags: {
                showAdvancedKpis: false
            },
            telemetry: {
                enableClientMetrics: true
            }
        });
})();
