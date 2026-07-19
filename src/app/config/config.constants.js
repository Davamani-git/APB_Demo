(function() {
  'use strict';

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
        simulateTrendsError: false
      },
      telemetry: {
        enabled: false
      }
    });
})();
