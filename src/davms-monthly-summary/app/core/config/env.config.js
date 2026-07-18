(function() {
  'use strict';

  angular
    .module('davmsMonthlySummaryApp')
    .constant('ENV_CONFIG', {
      apiBaseUrl: 'https://api.davms.example.com',
      apiTimeoutMs: 10000,
      maxLookbackMonths: 12,
      useMockData: true,
      featureFlags: {
        enableBreakdownChart: true,
        enableTopCategoryCard: true
      },
      telemetry: {
        enableLogging: true,
        logLevel: 'info'
      }
    });
})();
