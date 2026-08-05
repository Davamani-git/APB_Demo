(function() {
  'use strict';
  angular
    .module('execDashboardApp')
    .constant('ENV_CONFIG', {
      envName: 'LOCAL',
      apiBaseUrl: null,
      loggingLevel: 'INFO',
      featureFlags: {
        futureApiIntegration: false
      }
    });
})();
