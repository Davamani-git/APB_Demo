(function() {
  'use strict';

  function TelemetryLoggingConfig($logProvider) {
    $logProvider.debugEnabled(true);
  }

  TelemetryLoggingConfig.$inject = ['$logProvider'];

  angular.module('davms.app')
    .config(TelemetryLoggingConfig);
})();