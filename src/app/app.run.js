(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .run(AppRun);

  AppRun.$inject = ['EnvConfigService', 'TelemetryService'];

  function AppRun(EnvConfigService, TelemetryService) {
    EnvConfigService.loadEnvConfig();
    TelemetryService.initialize();
  }
})();
