(function () {
  'use strict';

  angular
    .module('app')
    .constant('TELEMETRY_CONFIG', {
      logLevel: 'info',
      enableClientMetrics: true
    });
})();
