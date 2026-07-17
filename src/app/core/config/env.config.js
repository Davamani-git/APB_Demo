(function () {
  'use strict';

  // envConfig also controls mock/real API selection
  angular.module('app.core')
    .constant('envConfig', {
      useMockApi: true,
      apiBaseUrl: '/api',
      maxHistoryMonths: 36,
      featureFlags: {
        enableAdvancedCharts: false
      },
      loggingLevel: 'INFO'
    });
}());
