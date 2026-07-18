(function () {
  'use strict';

  run.$inject = ['LoggingService', 'TelemetryService', 'EnvConfigService'];

  function run(LoggingService, TelemetryService, EnvConfigService) {
    EnvConfigService.initialize();
    LoggingService.info('DAVMS Monthly Spending Summary Dashboard application started.');
    TelemetryService.trackEvent('app_start', { feature: 'monthly_summary_dashboard' });
  }

  angular.module('davmsApp')
    .run(run);
})();
