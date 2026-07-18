(function () {
  'use strict';

  angular.module('davmsApp')
    .constant('ENV_CONFIG', {
      apiBaseUrl: 'https://api.bank.example.com/davms',
      apiTimeoutMs: 8000,
      maxLookbackMonths: 12,
      useMockData: true,
      featureFlags: {
        enableBreakdownChart: true,
        enableAvgTransactionKpi: true
      },
      telemetry: {
        enabled: true,
        endpointUrl: 'https://telemetry.bank.example.com/events'
      }
    });
})();
