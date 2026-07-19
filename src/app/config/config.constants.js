(function () {
    'use strict';

    ENVConfigInitializer.$inject = ['ENV_CONFIG'];

    function ENVConfigInitializer(ENV_CONFIG) {
        return ENV_CONFIG;
    }

    angular.module('app')
        .constant('ENV_CONFIG', {
            apiBaseUrl: 'https://api.example.com',
            apiTimeoutMs: 15000,
            maxLookbackMonths: 6,
            useMockData: true,
            featureFlags: {
                showCategoryBreakdown: true,
                showAverageSpend: true,
                simulateSummaryError: false,
                simulateTrendsError: false,
                simulateSummaryTimeout: false,
                simulateTrendsTimeout: false
            },
            telemetry: {
                enabled: true
            }
        });

})();
